import { Test, TestingModule } from '@nestjs/testing';
import { OptiongroupService } from './optiongroup.service';

describe('OptiongroupService', () => {
  let service: OptiongroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OptiongroupService],
    }).compile();

    service = module.get<OptiongroupService>(OptiongroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
