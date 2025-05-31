import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AwsConfigService } from './aws-config.service';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(S3Service.name);
  private readonly bucketName: string;

  constructor(private readonly awsConfigService: AwsConfigService) {
    this.s3Client = new S3Client(this.awsConfigService.awsConfig);
    this.bucketName = this.awsConfigService.s3BucketName;
    this.logger.log(`Initialized S3 service with bucket: ${this.bucketName}`);
    if (this.awsConfigService.useLocalstack) {
      this.logger.log('Using LocalStack for S3 services');
    }
  }

  /**
   * Upload a file to S3
   * @param key - The key (path) where the file will be stored
   * @param body - The file content
   * @param contentType - The content type of the file
   * @returns Promise with the result of the operation
   */
  async uploadFile(
    key: string,
    body: Buffer | string,
    contentType: string,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: body,
        ContentType: contentType,
      });

      await this.s3Client.send(command);
      this.logger.log(`Successfully uploaded file to ${key}`);

      return key;
    } catch (error) {
      this.logger.error(
        `Error uploading file to S3: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Generate a pre-signed URL for downloading a file
   * @param key - The key (path) of the file
   * @param expiresIn - URL expiration time in seconds (default: 3600)
   * @returns Promise with the pre-signed URL
   */
  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      // If using LocalStack, replace the internal Docker hostname with localhost
      // for client-side access
      if (this.awsConfigService.useLocalstack) {
        const clientUrl = signedUrl.replace('localstack:4566', 'localhost:4566');
        this.logger.debug(`Converted LocalStack URL: ${signedUrl} -> ${clientUrl}`);
        return clientUrl;
      }

      return signedUrl;
    } catch (error) {
      this.logger.error(
        `Error generating signed URL: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Delete a file from S3
   * @param key - The key (path) of the file to delete
   * @returns Promise with the result of the operation
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`Successfully deleted file: ${key}`);
    } catch (error) {
      this.logger.error(
        `Error deleting file from S3: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * List files in a directory
   * @param prefix - The directory prefix
   * @returns Promise with the list of files
   */
  async listFiles(prefix: string): Promise<string[]> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
      });

      const response = await this.s3Client.send(command);

      // Filter out undefined keys and return string array
      return (response.Contents || [])
        .filter((item) => item.Key !== undefined)
        .map((item) => item.Key as string);
    } catch (error) {
      this.logger.error(
        `Error listing files from S3: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get a file from S3
   * @param key - The key (path) of the file
   * @returns Promise with the file content
   */
  async getFile(key: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      // Check if Body exists before using it
      if (!response.Body) {
        throw new Error(`No body returned for key: ${key}`);
      }

      // Convert response body to buffer
      return Buffer.from(await response.Body.transformToByteArray());
    } catch (error) {
      this.logger.error(
        `Error getting file from S3: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
