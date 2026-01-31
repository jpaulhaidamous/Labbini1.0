import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to Labbini API - Lebanon\'s Freelance & Services Marketplace';
  }
}
