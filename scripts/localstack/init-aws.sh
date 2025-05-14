#!/bin/bash
# This script initializes AWS resources in Localstack

# Set AWS CLI to use Localstack
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
export AWS_ENDPOINT_URL=http://localhost:4566

echo "Initializing AWS resources in Localstack..."

# Create S3 bucket for media and documents storage
echo "Creating S3 bucket: heallink-storage"
awslocal s3 mb s3://heallink-storage
awslocal s3api put-bucket-acl --bucket heallink-storage --acl public-read

# Create DynamoDB tables for audit logging
echo "Creating DynamoDB table: heallink-audit-logs"
awslocal dynamodb create-table \
  --table-name heallink-audit-logs \
  --attribute-definitions AttributeName=id,AttributeType=S AttributeName=timestamp,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH AttributeName=timestamp,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

# Create Secrets Manager secrets for application
echo "Creating Secrets Manager secrets"
awslocal secretsmanager create-secret \
  --name heallink/api/secrets \
  --description "Development secrets for Heallink API" \
  --secret-string '{"jwt_secret":"local-dev-jwt-secret","refresh_token_secret":"local-dev-refresh-token-secret"}'

awslocal secretsmanager create-secret \
  --name heallink/api/credentials \
  --description "External service credentials for Heallink API" \
  --secret-string '{"stripe_api_key":"sk_test_example","sendgrid_api_key":"sg_test_example"}'

# Set up CloudWatch Log Group
echo "Creating CloudWatch Log Group: /heallink/api"
awslocal logs create-log-group --log-group-name /heallink/api

# Create sample IAM roles and policies for testing
echo "Creating IAM roles and policies"
awslocal iam create-role \
  --role-name heallink-app-role \
  --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"s3.amazonaws.com"},"Action":"sts:AssumeRole"}]}'

awslocal iam create-policy \
  --policy-name heallink-s3-policy \
  --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:GetObject","s3:PutObject"],"Resource":"arn:aws:s3:::heallink-storage/*"}]}'

awslocal iam attach-role-policy \
  --role-name heallink-app-role \
  --policy-arn arn:aws:iam::000000000000:policy/heallink-s3-policy

echo "AWS resources initialization complete!"