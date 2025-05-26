import { Controller, Get, Post, Body, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get application data' })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved application data',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  })
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 requests per minute for this endpoint
  getData() {
    this.logger.info('Getting application data', { context: 'AppController' });
    return this.appService.getData();
  }

  @Post('users')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        bio: { type: 'string' },
        createdAt: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @Throttle({ short: { limit: 3, ttl: 60000 } }) // 3 requests per minute for user creation
  createUser(@Body() createUserDto: CreateUserDto) {
    this.logger.info('Creating new user', { 
      context: 'AppController',
      userEmail: createUserDto.email 
    });
    return this.appService.createUser(createUserDto);
  }
}
