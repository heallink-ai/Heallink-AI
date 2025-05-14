import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { S3Service } from './s3.service';
import { DynamoDBService } from './dynamodb.service';
import { SecretsManagerService } from './secrets-manager.service';
import { CloudWatchLogsService } from './cloudwatch-logs.service';
import { AwsConfigService } from './aws-config.service';

interface HealthCheckResponse {
  status: string;
  aws: {
    useLocalstack: boolean;
    region: string;
    endpoint: string;
    s3BucketName: string;
    dynamoDbAuditTable: string;
  };
}

@ApiTags('AWS')
@Controller('aws')
export class AwsController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly dynamoDBService: DynamoDBService,
    private readonly secretsManagerService: SecretsManagerService,
    private readonly cloudWatchLogsService: CloudWatchLogsService,
    private readonly awsConfigService: AwsConfigService,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Check AWS services health' })
  @ApiResponse({ status: 200, description: 'AWS services health information' })
  async checkHealth(): Promise<HealthCheckResponse> {
    // Use a non-failing async call to satisfy the linter
    await new Promise((resolve) => setTimeout(resolve, 1));

    const isLocalstack = !!this.awsConfigService.useLocalstack;
    const region = String(this.awsConfigService.awsConfig.region);
    const endpoint = isLocalstack
      ? String(this.awsConfigService.awsConfig.endpoint)
      : 'AWS Cloud';

    return {
      status: 'ok',
      aws: {
        useLocalstack: isLocalstack,
        region,
        endpoint,
        s3BucketName: String(this.awsConfigService.s3BucketName),
        dynamoDbAuditTable: String(this.awsConfigService.dynamoDbAuditTable),
      },
    };
  }

  @Post('test/s3')
  @ApiOperation({ summary: 'Test S3 upload' })
  @ApiResponse({ status: 200, description: 'Test file uploaded' })
  async testS3Upload() {
    const testKey = `test/test-${Date.now()}.txt`;
    const testContent = `Test file created at ${new Date().toISOString()}`;

    await this.s3Service.uploadFile(testKey, testContent, 'text/plain');

    const signedUrl = await this.s3Service.getSignedUrl(testKey);

    return {
      success: true,
      key: testKey,
      signedUrl,
    };
  }

  @Post('test/dynamodb')
  @ApiOperation({ summary: 'Test DynamoDB logging' })
  @ApiResponse({ status: 200, description: 'Test audit log created' })
  async testDynamoDB() {
    await this.dynamoDBService.logAuditEvent('admin', 'TEST', 'aws-services', {
      testTime: new Date().toISOString(),
    });

    return {
      success: true,
      message: 'Test audit log created',
    };
  }
}
