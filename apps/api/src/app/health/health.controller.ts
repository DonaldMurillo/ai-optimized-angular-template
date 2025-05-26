import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheckService,
  HealthCheck,
  PrismaHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '@ai-optimized-angular-template/prisma';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private prisma: PrismaService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Check application health' })
  @ApiResponse({ status: 200, description: 'Health check successful' })
  @ApiResponse({ status: 503, description: 'Health check failed' })
  @HealthCheck()
  check() {
    return this.health.check([
      // Check if Prisma connection is healthy
      () => this.prismaHealth.pingCheck('database', this.prisma),
      
      // Check memory usage (heap should not exceed 150MB)
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      
      // Check RSS memory (should not exceed 150MB)
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      
      // Check disk usage (should not exceed 90% of disk space)
      () => this.disk.checkStorage('storage', { thresholdPercent: 0.9, path: '/' }),
    ]);
  }

  @Get('ready')
  @ApiOperation({ summary: 'Check if application is ready' })
  @ApiResponse({ status: 200, description: 'Application is ready' })
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
    ]);
  }

  @Get('live')
  @ApiOperation({ summary: 'Check if application is alive' })
  @ApiResponse({ status: 200, description: 'Application is alive' })
  @HealthCheck()
  liveness() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
    ]);
  }
}
