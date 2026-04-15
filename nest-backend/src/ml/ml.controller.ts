import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { MlService } from './ml.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { Multer } from 'multer';
import { PayloadValidationPipe } from 'src/pipes/payload-validation.pipe';
import { PipelinePayloadDTOSchema } from './dto/payload.dto';
import type { PipelinePayloadDTO } from './dto/payload.dto';

@Controller()
export class MlController {
  constructor(private readonly mlService: MlService) {}

  // @Post('/upload')
  // @UseInterceptors(FileInterceptor('file'))
  // process(@UploadedFile() file: Express.Multer.File) {
  //   return { 'Hello World': 'This is the ML Controller' };
  // }

  @Post('/process')
  @UseInterceptors(FileInterceptor('file'))
  async processFile(
    @Body('payload', new PayloadValidationPipe(PipelinePayloadDTOSchema))
    payload: PipelinePayloadDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.mlService.process(payload, file);
  }
}
