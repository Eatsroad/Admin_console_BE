import { Test, TestingModule } from '@nestjs/testing';
import { MenuboardController } from './menuboard.controller';

describe('MenuboardController', () => {
  let controller: MenuboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuboardController],
    }).compile();

    controller = module.get<MenuboardController>(MenuboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
