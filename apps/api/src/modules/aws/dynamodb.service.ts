import { Injectable, Logger } from '@nestjs/common';
import { 
  DynamoDBClient, 
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
  ScanCommand
} from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand, 
  QueryCommand as DocQueryCommand,
  ScanCommand as DocScanCommand
} from '@aws-sdk/lib-dynamodb';
import { AwsConfigService } from './aws-config.service';

@Injectable()
export class DynamoDBService {
  private readonly dynamoClient: DynamoDBClient;
  private readonly docClient: DynamoDBDocumentClient;
  private readonly logger = new Logger(DynamoDBService.name);
  private readonly auditTableName: string;

  constructor(private readonly awsConfigService: AwsConfigService) {
    this.dynamoClient = new DynamoDBClient(this.awsConfigService.awsConfig);
    this.docClient = DynamoDBDocumentClient.from(this.dynamoClient);
    this.auditTableName = this.awsConfigService.dynamoDbAuditTable;
    
    this.logger.log(`Initialized DynamoDB service with audit table: ${this.auditTableName}`);
    if (this.awsConfigService.useLocalstack) {
      this.logger.log('Using LocalStack for DynamoDB services');
    }
  }

  /**
   * Log an audit event to DynamoDB
   * @param userId - The ID of the user who performed the action
   * @param action - The action performed
   * @param resource - The resource that was affected
   * @param details - Additional details about the action
   * @returns Promise with the result of the operation
   */
  async logAuditEvent(
    userId: string, 
    action: string, 
    resource: string, 
    details?: Record<string, any>
  ): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      const id = `${userId}-${Date.now()}`;

      const command = new PutCommand({
        TableName: this.auditTableName,
        Item: {
          id,
          timestamp,
          userId,
          action,
          resource,
          details: details || {},
        },
      });

      await this.docClient.send(command);
      this.logger.debug(`Logged audit event: ${action} by ${userId} on ${resource}`);
    } catch (error) {
      this.logger.error(`Error logging audit event: ${error.message}`, error.stack);
      // In case of error, we don't want to crash the application
      // but we should log the error
    }
  }

  /**
   * Query audit logs for a specific user
   * @param userId - The ID of the user
   * @param startTime - Start time for the query
   * @param endTime - End time for the query
   * @returns Promise with the query results
   */
  async queryAuditLogsByUser(
    userId: string, 
    startTime?: string, 
    endTime?: string
  ): Promise<any[]> {
    try {
      // Build query expression and attribute values
      let keyConditionExpression = 'userId = :userId';
      const expressionAttributeValues: Record<string, any> = {
        ':userId': userId,
      };

      if (startTime && endTime) {
        keyConditionExpression += ' AND timestamp BETWEEN :startTime AND :endTime';
        expressionAttributeValues[':startTime'] = startTime;
        expressionAttributeValues[':endTime'] = endTime;
      } else if (startTime) {
        keyConditionExpression += ' AND timestamp >= :startTime';
        expressionAttributeValues[':startTime'] = startTime;
      } else if (endTime) {
        keyConditionExpression += ' AND timestamp <= :endTime';
        expressionAttributeValues[':endTime'] = endTime;
      }

      // Create a GlobalSecondaryIndex on userId and timestamp for this to work efficiently
      const command = new DocQueryCommand({
        TableName: this.auditTableName,
        IndexName: 'UserIdIndex', // Assuming this index exists
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues,
      });

      const response = await this.docClient.send(command);
      return response.Items || [];
    } catch (error) {
      this.logger.error(`Error querying audit logs: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Scan all audit logs with optional filters
   * @param limit - Maximum number of items to return
   * @param startKey - Key to start scanning from (for pagination)
   * @returns Promise with the scan results
   */
  async scanAuditLogs(limit = 50, startKey?: Record<string, any>): Promise<any> {
    try {
      const command = new DocScanCommand({
        TableName: this.auditTableName,
        Limit: limit,
        ExclusiveStartKey: startKey,
      });

      const response = await this.docClient.send(command);
      return {
        items: response.Items || [],
        lastEvaluatedKey: response.LastEvaluatedKey,
      };
    } catch (error) {
      this.logger.error(`Error scanning audit logs: ${error.message}`, error.stack);
      throw error;
    }
  }
}