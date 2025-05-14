import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsConfigService {
  constructor(private configService: ConfigService) {}

  get useLocalstack(): boolean {
    return this.configService.get<string>('USE_LOCALSTACK') === 'true';
  }

  get awsConfig(): Record<string, any> {
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    // Ensure both credentials are defined
    const credentials = {
      accessKeyId: accessKeyId || 'test',
      secretAccessKey: secretAccessKey || 'test',
    };

    const config = {
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
      credentials,
    };

    if (this.useLocalstack) {
      return {
        ...config,
        endpoint: this.configService.get<string>(
          'AWS_ENDPOINT',
          'http://localstack:4566',
        ),
        forcePathStyle: true, // Required for LocalStack
      };
    }

    return config;
  }

  get s3BucketName(): string {
    return this.configService.get<string>('S3_BUCKET_NAME', 'heallink-storage');
  }

  get dynamoDbAuditTable(): string {
    return this.configService.get<string>(
      'DYNAMODB_AUDIT_TABLE',
      'heallink-audit-logs',
    );
  }
}
