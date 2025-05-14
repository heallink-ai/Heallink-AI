import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './s3.service';
import { DynamoDBService } from './dynamodb.service';
import { SecretsManagerService } from './secrets-manager.service';
import { CloudWatchLogsService } from './cloudwatch-logs.service';
import { AwsConfigService } from './aws-config.service';
import { AwsController } from './aws.controller';

@Module({
  imports: [ConfigModule],
  controllers: [AwsController],
  providers: [
    AwsConfigService,
    S3Service,
    DynamoDBService,
    SecretsManagerService,
    CloudWatchLogsService,
  ],
  exports: [
    S3Service,
    DynamoDBService,
    SecretsManagerService,
    CloudWatchLogsService,
  ],
})
export class AwsModule {}
