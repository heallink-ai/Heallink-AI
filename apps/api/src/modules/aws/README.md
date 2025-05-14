# AWS Integration Module

This module provides integration with AWS services using the AWS SDK for Node.js. In local development, it connects to LocalStack to emulate AWS services.

## Services Included

- **S3**: For file storage (medical documents, user uploads, etc.)
- **DynamoDB**: For audit logging and other NoSQL data requirements
- **Secrets Manager**: For secure storage of sensitive credentials
- **CloudWatch Logs**: For centralized logging

## Configuration

AWS services are configured via environment variables:

```
# AWS Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_ENDPOINT=http://localstack:4566  # Only for LocalStack
USE_LOCALSTACK=true                   # Set to false in production

# S3 Configuration
S3_BUCKET_NAME=heallink-storage

# DynamoDB Configuration
DYNAMODB_AUDIT_TABLE=heallink-audit-logs
```

## LocalStack Setup

For local development, we use LocalStack to emulate AWS services. The setup is included in `docker-compose.yml`, and initialization scripts can be found in the `scripts/localstack` directory.

To initialize AWS resources in LocalStack manually:

```bash
# Make sure LocalStack is running
docker-compose up -d localstack

# Execute initialization script
docker-compose exec localstack bash /docker-entrypoint-initaws.d/init-aws.sh
```

## Health Check

You can check the status of AWS services by making a GET request to `/api/v1/aws/health`.

## Usage Examples

### S3 Service

```typescript
// Upload a file
const key = await s3Service.uploadFile(
  'path/to/file.pdf',
  fileBuffer,
  'application/pdf'
);

// Generate a signed URL for download
const url = await s3Service.getSignedUrl(key);
```

### DynamoDB Service

```typescript
// Log an audit event
await dynamoDBService.logAuditEvent(
  userId,
  'DOWNLOAD_MEDICAL_RECORD',
  'medical-records',
  { recordId: recordId }
);

// Query audit logs
const logs = await dynamoDBService.queryAuditLogsByUser(
  userId,
  '2023-01-01T00:00:00Z',
  '2023-12-31T23:59:59Z'
);
```

### Secrets Manager Service

```typescript
// Get a secret
const credentials = await secretsManagerService.getSecret('heallink/api/credentials');
const stripeApiKey = credentials.stripe_api_key;
```

### CloudWatch Logs Service

```typescript
// Log a message
await cloudWatchLogsService.logMessage(
  '/heallink/api',
  'user-activity',
  'User logged in',
  'INFO',
  { userId: '123', ip: '127.0.0.1' }
);
```