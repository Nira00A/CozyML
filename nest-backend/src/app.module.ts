import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MlController } from './ml/ml.controller';
import { MlService } from './ml/ml.service';

@Module({
  imports: [HttpModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, MlController],
  providers: [AppService, MlService],
})
export class AppModule {}
