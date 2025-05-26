import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, body, query, params } = request;
    const userAgent = request.get('User-Agent') || '';
    const ip = request.ip;
    
    const now = Date.now();
    
    this.logger.info('Incoming Request', {
      context: 'HTTP',
      method,
      url,
      userAgent,
      ip,
      body: method !== 'GET' ? body : undefined,
      query: Object.keys(query).length ? query : undefined,
      params: Object.keys(params).length ? params : undefined,
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - now;
          this.logger.info('Request Completed', {
            context: 'HTTP',
            method,
            url,
            statusCode: response.statusCode,
            responseTime: `${responseTime}ms`,
            responseSize: JSON.stringify(data).length,
          });
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          this.logger.error('Request Failed', {
            context: 'HTTP',
            method,
            url,
            statusCode: response.statusCode,
            responseTime: `${responseTime}ms`,
            error: error.message,
            stack: error.stack,
          });
        },
      })
    );
  }
}
