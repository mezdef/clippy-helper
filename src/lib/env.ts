import { z } from 'zod';

// Define the schema for environment variables
const envSchema = z.object({
  // Database - use custom validation for PostgreSQL URLs
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required')
    .refine(url => {
      try {
        const parsed = new URL(url);
        return (
          parsed.protocol === 'postgresql:' || parsed.protocol === 'postgres:'
        );
      } catch {
        return false;
      }
    }, 'DATABASE_URL must be a valid PostgreSQL connection string'),

  // OpenAI
  OPENAI_API_KEY: z
    .string()
    .min(1, 'OPENAI_API_KEY is required')
    .refine(
      key => key.startsWith('sk-'),
      'OPENAI_API_KEY must start with "sk-"'
    ),

  // Next.js
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Optional variables with defaults
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

// Type for validated environment variables
export type Env = z.infer<typeof envSchema>;

// Simple validation function
function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach(err => {
        const path = err.path.join('.');
        console.error(`  - ${path}: ${err.message}`);
      });
      console.error(
        '\nPlease check your .env file and ensure all required variables are set.'
      );
    }
    throw error;
  }
}

// Export validated environment variables
export const env = validateEnv();

// Runtime environment checks
export const envChecks = {
  // Check if we're in development
  isDevelopment: env.NODE_ENV === 'development',

  // Check if we're in production
  isProduction: env.NODE_ENV === 'production',

  // Check if we're in test
  isTest: env.NODE_ENV === 'test',

  // Check if database is configured
  hasDatabaseUrl: !!env.DATABASE_URL,

  // Check if OpenAI is configured
  hasOpenAIKey: !!env.OPENAI_API_KEY,

  // Validate database URL format
  validateDatabaseUrl: (): boolean => {
    try {
      const url = new URL(env.DATABASE_URL);
      return url.protocol === 'postgresql:' || url.protocol === 'postgres:';
    } catch {
      return false;
    }
  },

  // Check all critical services
  checkCriticalServices: (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!envChecks.hasDatabaseUrl) {
      errors.push('Database URL is not configured');
    } else if (!envChecks.validateDatabaseUrl()) {
      errors.push('Database URL is not a valid PostgreSQL connection string');
    }

    if (!envChecks.hasOpenAIKey) {
      errors.push('OpenAI API key is not configured');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

// Log environment status in development
if (typeof window === 'undefined' && envChecks.isDevelopment) {
  console.log('🔧 Environment Status:');
  console.log(`  - NODE_ENV: ${env.NODE_ENV}`);
  console.log(`  - Database: ${envChecks.hasDatabaseUrl ? '✅' : '❌'}`);
  console.log(`  - OpenAI: ${envChecks.hasOpenAIKey ? '✅' : '❌'}`);

  const criticalCheck = envChecks.checkCriticalServices();
  if (!criticalCheck.isValid) {
    console.warn('⚠️  Critical services not properly configured:');
    criticalCheck.errors.forEach(error => console.warn(`  - ${error}`));
  }
}
