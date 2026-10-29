import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API status and welcome message', () => {
      const response = appController.getHello();
      expect(response).toMatchObject({
        status: true,
        message: 'Welcome to LACI API',
        endpoints: ['/api/auth', '/api/categories', '/api/products'],
      });
      expect(response.serverTime).toBeDefined();
    });
  });
});
