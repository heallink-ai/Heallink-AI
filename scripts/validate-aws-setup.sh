#!/bin/bash
# This script validates the AWS setup in Localstack

# Exit on any error
set -e

echo "Validating AWS services in Localstack..."

# Check if Localstack is running
if ! docker compose ps | grep -q localstack; then
  echo "Error: Localstack container is not running. Start it with 'docker compose up -d localstack'"
  exit 1
fi

echo "✅ Localstack is running"

# Check if S3 bucket exists
if ! docker compose exec localstack awslocal s3 ls | grep -q heallink-storage; then
  echo "⚠️ S3 bucket 'heallink-storage' not found. Creating it now..."
  docker compose exec localstack awslocal s3 mb s3://heallink-storage
  docker compose exec localstack awslocal s3api put-bucket-acl --bucket heallink-storage --acl public-read
else
  echo "✅ S3 bucket 'heallink-storage' exists"
fi

# Check if DynamoDB table exists
if ! docker compose exec localstack awslocal dynamodb list-tables | grep -q heallink-audit-logs; then
  echo "⚠️ DynamoDB table 'heallink-audit-logs' not found. Creating it now..."
  docker compose exec localstack awslocal dynamodb create-table \
    --table-name heallink-audit-logs \
    --attribute-definitions AttributeName=id,AttributeType=S AttributeName=timestamp,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH AttributeName=timestamp,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
else
  echo "✅ DynamoDB table 'heallink-audit-logs' exists"
fi

# Check if Secrets Manager secrets exist
if ! docker compose exec localstack awslocal secretsmanager list-secrets | grep -q heallink/api/secrets; then
  echo "⚠️ Secret 'heallink/api/secrets' not found. Creating it now..."
  docker compose exec localstack awslocal secretsmanager create-secret \
    --name heallink/api/secrets \
    --description "Development secrets for Heallink API" \
    --secret-string '{"jwt_secret":"local-dev-jwt-secret","refresh_token_secret":"local-dev-refresh-token-secret"}'
else
  echo "✅ Secret 'heallink/api/secrets' exists"
fi

# Create a test file in S3
echo "Creating test file in S3..."
echo "Test content from validate script" > /tmp/test-file.txt
docker compose exec -T localstack awslocal s3 cp - s3://heallink-storage/test/validation-test.txt < /tmp/test-file.txt
rm /tmp/test-file.txt

# Check if the file was uploaded
if docker compose exec localstack awslocal s3 ls s3://heallink-storage/test/ | grep -q validation-test.txt; then
  echo "✅ Test file uploaded to S3 successfully"
else
  echo "❌ Failed to upload test file to S3"
  exit 1
fi

# Check if AWS service endpoint is accessible from the API container
if docker compose exec api curl -s -f http://localstack:4566/health > /dev/null; then
  echo "✅ Localstack is accessible from the API container"
else
  echo "❌ Localstack is not accessible from the API container"
  exit 1
fi

echo "🎉 AWS services validation completed successfully!"
echo ""
echo "To test the API's AWS integration, try:"
echo "curl http://localhost:3003/api/v1/aws/health"