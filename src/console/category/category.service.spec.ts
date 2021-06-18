import { Category } from '../../entities/category/category.entity';
import { Menu } from '../../entities/menu/menu.entity';
import { createMemoryDB } from '../../utils/connections/create-memory-db';
import { Connection, Repository } from 'typeorm';
import { CategoryService } from './category.service';
import { Store } from '../../entities/store/store.entity';
import { User } from '../../entities/user/user.entity';
import { CategoryCreateDto } from './dto/create-categoty.dto';
import { domainToASCII } from 'url';
import { ConflictException } from '@nestjs/common';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let connection : Connection;
  let categoryRepoditory: Repository<Category>;

  const CategoryName = "Cattegory";
  const CategoryDesc = "";
  const MenuIdsInCategory: number[] = [];
  const ResMenu: Menu[] = [];
  const CategoryDefaultState = true;

  
  const saveCategory = async (): Promise<Category> => {
    const savedCategory = new Category();

    savedCategory.setCategoryName = CategoryName;
    savedCategory.setCategoryDesc = CategoryDesc;
    savedCategory.menus = ResMenu;
    savedCategory.setCategoryState = true;
    
    return await categoryRepoditory.save(savedCategory);
  }

  beforeAll(async () => {
    connection = await createMemoryDB([Category, Menu, Store, User]);
    categoryRepoditory = await connection.getRepository(Category);
    categoryService = new CategoryService(categoryRepoditory);
  });

  afterAll(async () => {
    await connection.close();
  });
  
  afterEach(async () => {
    await categoryRepoditory.query("DELETE FROM categories");
  });

  it("shuld be defined", () => {
    expect(categoryService).toBeDefined();
  });

  it("Should Save category", async () => {
    const dto = new CategoryCreateDto();

    dto.description = CategoryDesc;
    dto.name = CategoryName;
    dto.state = CategoryDefaultState;
    dto.menus = MenuIdsInCategory;

    const responseDto = await categoryService.saveCategory(dto);

    expect(responseDto.name).toBe(CategoryName);
    expect(responseDto.description).toBe(CategoryDesc);
    expect(typeof responseDto.category_id).toBe("number");
    expect(responseDto.menus).toStrictEqual(ResMenu);
    expect(responseDto.state).toBe(true);   
  })

  it("Should not Save category and throw ConfilctExeception", async () => {
    expect.assertions(1);

    const savedCategory = new Category();
    savedCategory.setCategoryName = CategoryName;
    savedCategory.setCategoryDesc = CategoryDesc;
    savedCategory.setCategoryState = CategoryDefaultState;
    await categoryRepoditory.save(savedCategory);

    const dto = new CategoryCreateDto();

    dto.description = CategoryDesc;
    dto.name = CategoryName;
    dto.state = CategoryDefaultState;

    try {
      await categoryService.saveCategory(dto);
    } catch (exception) {
      expect(exception).toBeInstanceOf(ConflictException);
    }
  });

});
