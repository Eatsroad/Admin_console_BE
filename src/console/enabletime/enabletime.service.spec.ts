import { Test, TestingModule } from '@nestjs/testing';
import { EnabletimeService } from './enabletime.service';

describe('EnabletimeService', () => {
  let service: EnabletimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnabletimeService],
    }).compile();

    service = module.get<EnabletimeService>(EnabletimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
