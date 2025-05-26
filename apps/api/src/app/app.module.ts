import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '@ai-optimized-angular-template/prisma';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {

  constructor(private readonly configService: ConfigService,private readonly prismaService: PrismaService ) {

  }
}
