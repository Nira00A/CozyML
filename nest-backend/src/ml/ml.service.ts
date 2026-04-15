import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import FormData from 'form-data';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MlService {
  constructor(private readonly httpService: HttpService) {}

  async process(file: Express.Multer.File) {
    // Implementing Python post with nestjs
    const formData = new FormData();

    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          process.env.PYTHON_API_URL + '/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        ),
      );
      return response.data;
    } catch (error: Error | any) {
      throw new Error(`Python ML Backend Error: ${error.message}`);
    }
  }
}
