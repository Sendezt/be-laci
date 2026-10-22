import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      status: true,
      message: 'Welcome to LACI API',
      endpoints: ['/api/auth', '/api/categories', '/api/products'],
      serverTime: new Date().toLocaleDateString('id-ID', {
        timeZone: 'Asia/Jakarta',
      }),
    };
  }
}
