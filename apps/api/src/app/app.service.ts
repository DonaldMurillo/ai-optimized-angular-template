import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  getData(): { message: string } {
    this.logger.info('Retrieving application data', { context: 'AppService' });
    return { message: 'Hello API' };
  }

  createUser(createUserDto: CreateUserDto) {
    this.logger.info('Creating user in service', { 
      context: 'AppService',
      userEmail: createUserDto.email 
    });
    
    // Mock user creation - in real app this would interact with database
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      ...createUserDto,
      createdAt: new Date().toISOString(),
    };

    this.logger.info('User created successfully', { 
      context: 'AppService',
      userId: user.id 
    });

    return user;
  }
}
