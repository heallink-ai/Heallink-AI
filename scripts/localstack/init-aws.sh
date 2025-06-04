#!/bin/bash
# This script initializes AWS resources in Localstack

# Set AWS CLI to use Localstack
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
export AWS_ENDPOINT_URL=http://localhost:4566

echo "Initializing AWS resources in Localstack..."

# Check if S3 bucket already exists, create if not
BUCKET_NAME="heallink-storage"
echo "Checking for S3 bucket: $BUCKET_NAME"
if awslocal s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'
then
    echo "Creating S3 bucket: $BUCKET_NAME"
    awslocal s3 mb "s3://$BUCKET_NAME" || { echo "Failed to create S3 bucket"; exit 1; }
    echo "Setting bucket ACL to public-read"
    awslocal s3api put-bucket-acl --bucket "$BUCKET_NAME" --acl public-read || { echo "Failed to set bucket ACL"; exit 1; }
else
    echo "S3 bucket $BUCKET_NAME already exists"
fi

# Check if DynamoDB table exists, create if not
TABLE_NAME="heallink-audit-logs"
echo "Checking for DynamoDB table: $TABLE_NAME"
if ! awslocal dynamodb describe-table --table-name "$TABLE_NAME" 2>/dev/null; then
    echo "Creating DynamoDB table: $TABLE_NAME"
    awslocal dynamodb create-table \
      --table-name "$TABLE_NAME" \
      --attribute-definitions AttributeName=id,AttributeType=S AttributeName=timestamp,AttributeType=S \
      --key-schema AttributeName=id,KeyType=HASH AttributeName=timestamp,KeyType=RANGE \
      --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 || { echo "Failed to create DynamoDB table"; exit 1; }
else
    echo "DynamoDB table $TABLE_NAME already exists"
fi

# Check and create secrets if they don't exist
API_SECRET_NAME="heallink/api/secrets"
echo "Checking for Secret: $API_SECRET_NAME"
if ! awslocal secretsmanager describe-secret --secret-id "$API_SECRET_NAME" 2>/dev/null; then
    echo "Creating Secrets Manager secret: $API_SECRET_NAME"
    awslocal secretsmanager create-secret \
      --name "$API_SECRET_NAME" \
      --description "Development secrets for Heallink API" \
      --secret-string '{"jwt_secret":"local-dev-jwt-secret","refresh_token_secret":"local-dev-refresh-token-secret"}' || { echo "Failed to create API secret"; exit 1; }
else
    echo "Secret $API_SECRET_NAME already exists"
fi

CRED_SECRET_NAME="heallink/api/credentials"
echo "Checking for Secret: $CRED_SECRET_NAME"
if ! awslocal secretsmanager describe-secret --secret-id "$CRED_SECRET_NAME" 2>/dev/null; then
    echo "Creating Secrets Manager secret: $CRED_SECRET_NAME"
    awslocal secretsmanager create-secret \
      --name "$CRED_SECRET_NAME" \
      --description "External service credentials for Heallink API" \
      --secret-string '{"stripe_api_key":"sk_test_example","sendgrid_api_key":"sg_test_example"}' || { echo "Failed to create credential secret"; exit 1; }
else
    echo "Secret $CRED_SECRET_NAME already exists"
fi

# Set up CloudWatch Log Group if it doesn't exist
LOG_GROUP_NAME="/heallink/api"
echo "Checking for CloudWatch Log Group: $LOG_GROUP_NAME"
if ! awslocal logs describe-log-groups --log-group-name-prefix "$LOG_GROUP_NAME" 2>/dev/null | grep -q "$LOG_GROUP_NAME"; then
    echo "Creating CloudWatch Log Group: $LOG_GROUP_NAME"
    awslocal logs create-log-group --log-group-name "$LOG_GROUP_NAME" || { echo "Failed to create CloudWatch log group"; exit 1; }
else
    echo "CloudWatch Log Group $LOG_GROUP_NAME already exists"
fi

# Create IAM roles and policies if they don't exist
ROLE_NAME="heallink-app-role"
POLICY_NAME="heallink-s3-policy"

echo "Creating IAM roles and policies if needed"
if ! awslocal iam get-role --role-name "$ROLE_NAME" 2>/dev/null; then
    echo "Creating IAM role: $ROLE_NAME"
    awslocal iam create-role \
      --role-name "$ROLE_NAME" \
      --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"s3.amazonaws.com"},"Action":"sts:AssumeRole"}]}' || { echo "Failed to create IAM role"; exit 1; }
else
    echo "IAM role $ROLE_NAME already exists"
fi

if ! awslocal iam get-policy --policy-arn "arn:aws:iam::000000000000:policy/$POLICY_NAME" 2>/dev/null; then
    echo "Creating IAM policy: $POLICY_NAME"
    awslocal iam create-policy \
      --policy-name "$POLICY_NAME" \
      --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:GetObject","s3:PutObject"],"Resource":"arn:aws:s3:::heallink-storage/*"}]}' || { echo "Failed to create IAM policy"; exit 1; }
else
    echo "IAM policy $POLICY_NAME already exists"
fi

# Attach policy to role (idempotent operation)
echo "Attaching policy to role"
awslocal iam attach-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-arn "arn:aws:iam::000000000000:policy/$POLICY_NAME" || { echo "Failed to attach policy to role"; exit 1; }

echo "AWS resources initialization complete!"