import { env, envChecks } from './env';

export interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  message: string;
  timestamp: string;
  responseTime?: number;
}

export interface SystemHealth {
  overall: 'healthy' | 'unhealthy' | 'degraded';
  checks: HealthCheckResult[];
  timestamp: string;
}

// Health check functions
const healthChecks = {
  // Check database connectivity
  database: async (): Promise<HealthCheckResult> => {
    const start = Date.now();

    try {
      if (!envChecks.hasDatabaseUrl) {
        return {
          service: 'database',
          status: 'unhealthy',
          message: 'Database URL not configured',
          timestamp: new Date().toISOString(),
        };
      }

      if (!envChecks.validateDatabaseUrl()) {
        return {
          service: 'database',
          status: 'unhealthy',
          message: 'Invalid database URL format',
          timestamp: new Date().toISOString(),
        };
      }

      // In a real app, you might want to test the actual connection
      // For now, we'll just validate the URL format
      const responseTime = Date.now() - start;

      return {
        service: 'database',
        status: 'healthy',
        message: 'Database configuration is valid',
        timestamp: new Date().toISOString(),
        responseTime,
      };
    } catch (error) {
      return {
        service: 'database',
        status: 'unhealthy',
        message: `Database check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - start,
      };
    }
  },

  // Check OpenAI API configuration
  openai: async (): Promise<HealthCheckResult> => {
    const start = Date.now();

    try {
      if (!envChecks.hasOpenAIKey) {
        return {
          service: 'openai',
          status: 'unhealthy',
          message: 'OpenAI API key not configured',
          timestamp: new Date().toISOString(),
        };
      }

      // Basic API key format validation
      if (!env.OPENAI_API_KEY.startsWith('sk-')) {
        return {
          service: 'openai',
          status: 'unhealthy',
          message: 'Invalid OpenAI API key format',
          timestamp: new Date().toISOString(),
        };
      }

      const responseTime = Date.now() - start;

      return {
        service: 'openai',
        status: 'healthy',
        message: 'OpenAI API key is configured',
        timestamp: new Date().toISOString(),
        responseTime,
      };
    } catch (error) {
      return {
        service: 'openai',
        status: 'unhealthy',
        message: `OpenAI check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - start,
      };
    }
  },

  // Check environment configuration
  environment: async (): Promise<HealthCheckResult> => {
    const start = Date.now();

    try {
      const criticalCheck = envChecks.checkCriticalServices();
      const responseTime = Date.now() - start;

      if (criticalCheck.isValid) {
        return {
          service: 'environment',
          status: 'healthy',
          message: 'All environment variables are configured correctly',
          timestamp: new Date().toISOString(),
          responseTime,
        };
      } else {
        return {
          service: 'environment',
          status: 'unhealthy',
          message: `Environment issues: ${criticalCheck.errors.join(', ')}`,
          timestamp: new Date().toISOString(),
          responseTime,
        };
      }
    } catch (error) {
      return {
        service: 'environment',
        status: 'unhealthy',
        message: `Environment check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - start,
      };
    }
  },
};

// Run all health checks
export const runHealthChecks = async (): Promise<SystemHealth> => {
  const checks = await Promise.all([
    healthChecks.environment(),
    healthChecks.database(),
    healthChecks.openai(),
  ]);

  // Determine overall health
  const hasUnhealthy = checks.some(check => check.status === 'unhealthy');
  const hasDegraded = checks.some(check => check.status === 'degraded');

  let overall: SystemHealth['overall'] = 'healthy';
  if (hasUnhealthy) {
    overall = 'unhealthy';
  } else if (hasDegraded) {
    overall = 'degraded';
  }

  return {
    overall,
    checks,
    timestamp: new Date().toISOString(),
  };
};

// Quick health check for critical services only
export const quickHealthCheck = (): {
  isHealthy: boolean;
  errors: string[];
} => {
  const criticalCheck = envChecks.checkCriticalServices();
  return {
    isHealthy: criticalCheck.isValid,
    errors: criticalCheck.errors,
  };
};

// Log health status (useful for monitoring)
export const logHealthStatus = async (): Promise<void> => {
  if (envChecks.isDevelopment) {
    const health = await runHealthChecks();

    console.log(`🏥 System Health: ${health.overall.toUpperCase()}`);
    health.checks.forEach(check => {
      const icon =
        check.status === 'healthy'
          ? '✅'
          : check.status === 'degraded'
            ? '⚠️'
            : '❌';
      console.log(`  ${icon} ${check.service}: ${check.message}`);
      if (check.responseTime) {
        console.log(`    Response time: ${check.responseTime}ms`);
      }
    });
  }
};
