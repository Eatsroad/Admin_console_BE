import { Test, TestingModule } from '@nestjs/testing';
import { OptiongroupController } from './optiongroup.controller';

describe('OptiongroupController', () => {
  let controller: OptiongroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptiongroupController],
    }).compile();

    controller = module.get<OptiongroupController>(OptiongroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
