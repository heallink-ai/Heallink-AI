import { Injectable, Logger } from '@nestjs/common';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
  CreateSecretCommand,
  UpdateSecretCommand,
  DeleteSecretCommand,
} from '@aws-sdk/client-secrets-manager';
import { AwsConfigService } from './aws-config.service';

@Injectable()
export class SecretsManagerService {
  private readonly secretsClient: SecretsManagerClient;
  private readonly logger = new Logger(SecretsManagerService.name);

  constructor(private readonly awsConfigService: AwsConfigService) {
    this.secretsClient = new SecretsManagerClient(
      this.awsConfigService.awsConfig,
    );

    this.logger.log('Initialized Secrets Manager service');
    if (this.awsConfigService.useLocalstack) {
      this.logger.log('Using LocalStack for Secrets Manager services');
    }
  }

  /**
   * Get a secret value by name
   * @param secretName - The name of the secret
   * @returns Promise with the secret value
   */
  async getSecret<T = Record<string, any>>(secretName: string): Promise<T> {
    try {
      const command = new GetSecretValueCommand({
        SecretId: secretName,
      });

      const response = await this.secretsClient.send(command);
      const secretValue = response.SecretString;

      if (!secretValue) {
        throw new Error(`No secret string found for ${secretName}`);
      }

      return JSON.parse(secretValue) as T;
    } catch (error) {
      this.logger.error(
        `Error getting secret ${secretName}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Create a new secret
   * @param secretName - The name of the secret
   * @param secretValue - The value of the secret (object will be JSON stringified)
   * @param description - Optional description
   * @returns Promise with the ARN of the created secret
   */
  async createSecret(
    secretName: string,
    secretValue: Record<string, any>,
    description?: string,
  ): Promise<string> {
    try {
      const command = new CreateSecretCommand({
        Name: secretName,
        SecretString: JSON.stringify(secretValue),
        Description: description,
      });

      const response = await this.secretsClient.send(command);
      this.logger.log(`Created secret: ${secretName}`);

      return response.ARN || secretName;
    } catch (error) {
      this.logger.error(
        `Error creating secret ${secretName}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Update an existing secret
   * @param secretName - The name of the secret
   * @param secretValue - The new value of the secret
   * @returns Promise with the ARN of the updated secret
   */
  async updateSecret(
    secretName: string,
    secretValue: Record<string, any>,
  ): Promise<string> {
    try {
      const command = new UpdateSecretCommand({
        SecretId: secretName,
        SecretString: JSON.stringify(secretValue),
      });

      const response = await this.secretsClient.send(command);
      this.logger.log(`Updated secret: ${secretName}`);

      return response.ARN || secretName;
    } catch (error) {
      this.logger.error(
        `Error updating secret ${secretName}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Delete a secret
   * @param secretName - The name of the secret
   * @param forceDelete - Whether to force deletion without recovery window
   * @returns Promise indicating success
   */
  async deleteSecret(secretName: string, forceDelete = false): Promise<void> {
    try {
      const command = new DeleteSecretCommand({
        SecretId: secretName,
        ForceDeleteWithoutRecovery: forceDelete,
        // If not force deleting, use a 7-day recovery window
        RecoveryWindowInDays: forceDelete ? undefined : 7,
      });

      await this.secretsClient.send(command);
      this.logger.log(`Deleted secret: ${secretName}`);
    } catch (error) {
      this.logger.error(
        `Error deleting secret ${secretName}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
