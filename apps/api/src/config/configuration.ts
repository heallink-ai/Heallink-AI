import * as Joi from 'joi';

export interface EnvironmentVariables {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
  CORS_ORIGIN: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  FACEBOOK_CLIENT_ID: string;
  FACEBOOK_CLIENT_SECRET: string;
  APPLE_ID: string;
  APPLE_SECRET: string;
  EMAIL_SERVER_HOST: string;
  EMAIL_SERVER_PORT: number;
  EMAIL_SERVER_USER: string;
  EMAIL_SERVER_PASSWORD: string;
  EMAIL_FROM: string;
  RESEND_API_KEY: string;
  ADMIN_SETUP_KEY: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
  AWS_ENDPOINT: string;
  USE_LOCALSTACK: string;
  S3_BUCKET_NAME: string;
  DYNAMODB_AUDIT_TABLE: string;
  FRONTEND_URL: string;
  ADMIN_FRONTEND_URL: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_FROM_NUMBER: string;
}

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3003),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  CORS_ORIGIN: Joi.string().default('*'),
  GOOGLE_CLIENT_ID: Joi.string().optional(),
  GOOGLE_CLIENT_SECRET: Joi.string().optional(),
  FACEBOOK_CLIENT_ID: Joi.string().optional(),
  FACEBOOK_CLIENT_SECRET: Joi.string().optional(),
  APPLE_ID: Joi.string().optional(),
  TWILIO_ACCOUNT_SID: Joi.string().optional(),
  TWILIO_AUTH_TOKEN: Joi.string().optional(),
  TWILIO_FROM_NUMBER: Joi.string().optional(),
  APPLE_SECRET: Joi.string().optional(),
  EMAIL_SERVER_HOST: Joi.string().optional(),
  EMAIL_SERVER_PORT: Joi.number().optional(),
  EMAIL_SERVER_USER: Joi.string().optional(),
  EMAIL_SERVER_PASSWORD: Joi.string().optional(),
  EMAIL_FROM: Joi.string().optional(),
  RESEND_API_KEY: Joi.string().optional(),
  ADMIN_SETUP_KEY: Joi.string().default('heallink_setup_key'),
  // AWS Configuration
  AWS_ACCESS_KEY_ID: Joi.string().optional(),
  AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
  AWS_REGION: Joi.string().default('us-east-1'),
  AWS_ENDPOINT: Joi.string().optional(),
  USE_LOCALSTACK: Joi.string().valid('true', 'false').default('false'),
  S3_BUCKET_NAME: Joi.string().default('heallink-storage'),
  DYNAMODB_AUDIT_TABLE: Joi.string().default('heallink-audit-logs'),
  // Frontend URLs
  FRONTEND_URL: Joi.string().default('http://localhost:3000'),
  ADMIN_FRONTEND_URL: Joi.string().default('http://localhost:3002'),
});

export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || '3003', 10),
  database: {
    uri: process.env.DATABASE_URL || 'mongodb://localhost:27018/heallink',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-jwt-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-jwt-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    },
    apple: {
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET,
    },
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_FROM_NUMBER || '+15005550006', // Default Twilio test number
  },
  email: {
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587', 10),
    user: process.env.EMAIL_SERVER_USER,
    password: process.env.EMAIL_SERVER_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@heallink.io',
    resendApiKey: process.env.RESEND_API_KEY,
  },
  admin: {
    setupKey: process.env.ADMIN_SETUP_KEY || 'heallink_setup_key',
  },
  app: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    adminUrl: process.env.ADMIN_FRONTEND_URL || 'http://localhost:3002',
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    endpoint: process.env.AWS_ENDPOINT,
    useLocalstack: process.env.USE_LOCALSTACK === 'true',
    s3: {
      bucketName: process.env.S3_BUCKET_NAME || 'heallink-storage',
    },
    dynamodb: {
      auditTable: process.env.DYNAMODB_AUDIT_TABLE || 'heallink-audit-logs',
    },
  },
});
