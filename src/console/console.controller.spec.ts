import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleController } from './console.controller';

describe('ConsoleController', () => {
  let controller: ConsoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsoleController],
    }).compile();

    controller = module.get<ConsoleController>(ConsoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
