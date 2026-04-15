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
}
