import { Test, TestingModule } from '@nestjs/testing';
import { Menu } from 'src/entities/menu/menu.entity';
import { Connection, Repository } from 'typeorm';
import { MenuService } from './menu.service';

describe('MenuService', () => {
  let service: MenuService;
  let connection: Connection;
  let menuRepository: Repository<Menu>;

  const NAME= 'NAME';
  const PRICE = 5000;
  const DESC= 'vlvmdlvmrkm';
  const STATE= true;

  const saveUser = async (): Promise<Menu> => {
    const savedMenu = new Menu();
    savedMenu.setName = NAME;
    savedMenu.setPrice = PRICE;
    savedMenu.setDesc = DESC;
    savedMenu.setState = STATE;
    return await menuRepository.save(savedMenu);
  };
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuService],
    }).compile();

    service = module.get<MenuService>(MenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
