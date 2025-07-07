import { NextResponse } from 'next/server';
import { runHealthChecks } from '@/lib/health-check';

export async function GET() {
  try {
    const health = await runHealthChecks();

    // Set appropriate HTTP status based on health
    const status = health.overall === 'healthy' ? 200 : 503;

    return NextResponse.json(health, { status });
  } catch (error) {
    return NextResponse.json(
      {
        overall: 'unhealthy',
        checks: [],
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
