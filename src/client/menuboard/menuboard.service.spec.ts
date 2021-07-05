import { Test, TestingModule } from '@nestjs/testing';
import { MenuboardService } from './menuboard.service';

describe('MenuboardService', () => {
  let service: MenuboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuboardService],
    }).compile();

    service = module.get<MenuboardService>(MenuboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
