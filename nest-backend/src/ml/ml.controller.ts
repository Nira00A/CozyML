import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MlService } from './ml.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { Multer } from 'multer';

@Controller()
export class MlController {
  constructor(private readonly mlService: MlService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  process(@UploadedFile() file: Express.Multer.File) {
    return this.mlService.process(file);
  }

  @Post('/process')
  @UseInterceptors(FileInterceptor('file'))
  async processFile(@UploadedFile() file: Express.Multer.File) {
    return this.mlService.process(file);
  }
}
