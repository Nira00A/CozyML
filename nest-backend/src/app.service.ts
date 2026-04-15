import { HttpService } from '@nestjs/axios';
import { HttpServer, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async uploadFile(file: Express.Multer.File) {
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
