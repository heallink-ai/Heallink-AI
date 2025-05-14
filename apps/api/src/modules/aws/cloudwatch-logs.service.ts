import { Injectable, Logger } from '@nestjs/common';
import { 
  CloudWatchLogsClient, 
  PutLogEventsCommand,
  CreateLogGroupCommand,
  CreateLogStreamCommand,
  DescribeLogStreamsCommand
} from '@aws-sdk/client-cloudwatch-logs';
import { AwsConfigService } from './aws-config.service';

@Injectable()
export class CloudWatchLogsService {
  private readonly cloudWatchClient: CloudWatchLogsClient;
  private readonly logger = new Logger(CloudWatchLogsService.name);
  private sequenceToken: string | undefined;

  constructor(private readonly awsConfigService: AwsConfigService) {
    this.cloudWatchClient = new CloudWatchLogsClient(this.awsConfigService.awsConfig);
    
    this.logger.log('Initialized CloudWatch Logs service');
    if (this.awsConfigService.useLocalstack) {
      this.logger.log('Using LocalStack for CloudWatch Logs services');
    }
  }

  /**
   * Ensure the log group and stream exist
   * @param logGroupName - The name of the log group
   * @param logStreamName - The name of the log stream
   */
  async ensureLogGroupAndStream(logGroupName: string, logStreamName: string): Promise<void> {
    try {
      // Create log group if it doesn't exist
      try {
        await this.cloudWatchClient.send(
          new CreateLogGroupCommand({
            logGroupName,
          })
        );
        this.logger.log(`Created log group: ${logGroupName}`);
      } catch (error) {
        // Ignore if the log group already exists
        if (error.name !== 'ResourceAlreadyExistsException') {
          throw error;
        }
      }

      // Create log stream if it doesn't exist
      try {
        await this.cloudWatchClient.send(
          new CreateLogStreamCommand({
            logGroupName,
            logStreamName,
          })
        );
        this.logger.log(`Created log stream: ${logStreamName}`);
      } catch (error) {
        // Ignore if the log stream already exists
        if (error.name !== 'ResourceAlreadyExistsException') {
          throw error;
        }
      }
      
      // Get the sequence token for the stream
      const describeStreamsResponse = await this.cloudWatchClient.send(
        new DescribeLogStreamsCommand({
          logGroupName,
          logStreamNamePrefix: logStreamName,
        })
      );
      
      const stream = describeStreamsResponse.logStreams?.find(s => s.logStreamName === logStreamName);
      this.sequenceToken = stream?.uploadSequenceToken;
    } catch (error) {
      this.logger.error(
        `Error ensuring log group/stream (${logGroupName}/${logStreamName}): ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Log a message to CloudWatch Logs
   * @param logGroupName - The name of the log group
   * @param logStreamName - The name of the log stream
   * @param message - The message to log
   * @param level - The log level
   * @param additionalInfo - Additional information to include
   */
  async logMessage(
    logGroupName: string,
    logStreamName: string,
    message: string,
    level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' = 'INFO',
    additionalInfo: Record<string, any> = {}
  ): Promise<void> {
    try {
      await this.ensureLogGroupAndStream(logGroupName, logStreamName);

      const timestamp = new Date().getTime();
      const logEvent = {
        message: JSON.stringify({
          timestamp: new Date().toISOString(),
          level,
          message,
          ...additionalInfo,
        }),
        timestamp,
      };

      const command = new PutLogEventsCommand({
        logGroupName,
        logStreamName,
        logEvents: [logEvent],
        sequenceToken: this.sequenceToken,
      });

      const response = await this.cloudWatchClient.send(command);
      this.sequenceToken = response.nextSequenceToken;
    } catch (error) {
      // If InvalidSequenceTokenException, try to get the correct sequence token
      if (error.name === 'InvalidSequenceTokenException') {
        this.logger.warn(`Invalid sequence token, updating and retrying: ${error.message}`);
        
        // Extract the expected sequence token from the error message
        const match = error.message.match(/The next expected sequenceToken is: (\S+)/);
        if (match && match[1]) {
          this.sequenceToken = match[1];
          
          // Retry with the updated sequence token
          await this.logMessage(logGroupName, logStreamName, message, level, additionalInfo);
          return;
        }
      }
      
      this.logger.error(`Error logging to CloudWatch: ${error.message}`, error.stack);
      // Don't throw the error to prevent application disruption
    }
  }
}