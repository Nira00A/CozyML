import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import FormData from 'form-data';
import { HttpService } from '@nestjs/axios';
import { PipelinePayloadDTO } from './dto/payload.dto';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MlService {
  constructor(private readonly httpService: HttpService) {}

  async process(payload: PipelinePayloadDTO, file: Express.Multer.File) {
    // Implementing Python post with nestjs
    const formData = new FormData();

    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    formData.append('payload', JSON.stringify(payload));

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          process.env.PYTHON_API_URL + '/preprocess',
          formData,
          {
            headers: {
              ...formData.getHeaders(),
            },
          },
        ),
      );
      return response.data;
    } catch (error: Error | any) {
      if (error.response) {
        const status = error.response.status;
        const pythonErrorBody = error.response.data;

        throw new HttpException(pythonErrorBody, status);
      }

      throw new InternalServerErrorException(
        'An error occurred while processing the request.',
      );
    }
  }
}
