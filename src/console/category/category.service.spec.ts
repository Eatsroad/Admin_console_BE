import { Category } from '../../entities/category/category.entity';
import { Menu } from '../../entities/menu/menu.entity';
import { createMemoryDB } from '../../utils/connections/create-memory-db';
import { Connection, Repository } from 'typeorm';
import { CategoryService } from './category.service';
import { Store } from '../../entities/store/store.entity';
import { User } from '../../entities/user/user.entity';
import { CategoryCreateDto } from './dto/create-categoty.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CategoryUpdatedto } from './dto/update-category.dto';
import { BasicMessageDto } from '../../common/dtos/basic-massage.dto';
import { CategoryMenuUpdateDto } from './dto/update-category-menus.dto';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let connection : Connection;
  let categoryRepoditory: Repository<Category>;

  const CategoryName = "Category";
  const CategoryDesc = "";
  const MenuIdsInCategory: number[] = [];
  const ResMenu: Menu[] = [];
  const CategoryDefaultState = "true";

  const saveCategory = async (): Promise<Category> => {
    const savedCategory = new Category();

    savedCategory.setCategoryName = CategoryName;
    savedCategory.setCategoryDesc = CategoryDesc;
    savedCategory.menus = ResMenu;
    savedCategory.setCategoryState = "true";
    
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

  it("Should Save category with empty menus", async () => {
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
  });

  it("Should Save category with not empty menus", async () => {
    const menu1 = new Menu();
    menu1.setMenuName = "menu1";
    menu1.setMenuPrice = 5000;
    await connection.manager.save(menu1);

    const menu2 = new Menu();
    menu2.setMenuName = "menu2"
    menu2.setMenuPrice = 4000;
    await connection.manager.save(menu2);

    const MenuList = [menu1, menu2];

    const dto = new CategoryCreateDto();

    dto.description = CategoryDesc;
    dto.name = CategoryName;
    dto.state = CategoryDefaultState;
    dto.menus = [1, 2];

    const responseDto = await categoryService.saveCategory(dto);

    expect(responseDto.name).toBe(CategoryName);
    expect(responseDto.description).toBe(CategoryDesc);
    expect(typeof responseDto.category_id).toBe("number");
    expect(responseDto.menus).toStrictEqual(MenuList);
    expect(responseDto.state).toBe(true);   
  });

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

  it("Should get category info correctly", async () => {
    const menu1 = new Menu();
    menu1.setMenuName = "menu1";
    menu1.setMenuPrice = 5000;
    await connection.manager.save(menu1);

    const menu2 = new Menu();
    menu2.setMenuName = "menu2"
    menu2.setMenuPrice = 4000;
    await connection.manager.save(menu2);

    const MenuList = [menu1, menu2];

    const savedCategory = new Category();
    savedCategory.setCategoryName = CategoryName;
    savedCategory.setCategoryDesc = CategoryDesc;
    savedCategory.setCategoryState = CategoryDefaultState;
    savedCategory.menus = MenuList;

    await categoryRepoditory.save(savedCategory);

    const response = await categoryService.getCategoryInfo(savedCategory.getCategoryId);
    expect(response.category_id).toBe(savedCategory.getCategoryId);
    expect(response.description).toBe(savedCategory.getCategoryDesc);
    expect(response.name).toBe(savedCategory.getCategoryName);
    expect(response.menus).toStrictEqual(savedCategory.menus);
  });

  it("Should throw NotFoundException if category_id is invalid", async () => {
    expect.assertions(1);
    try {
      await categoryService.getCategoryInfo(-1);
    } catch (exception) {
      expect(exception).toBeInstanceOf(NotFoundException);
    }
  });
  
  it("Should Update Category Name, Description", async () => {
    const savedCategory = new Category();
    savedCategory.setCategoryName = CategoryName;
    savedCategory.setCategoryDesc = CategoryDesc;
    savedCategory.setCategoryState = CategoryDefaultState;

    await categoryRepoditory.save(savedCategory);

    const updateDto = new CategoryUpdatedto();
    updateDto.name = "updated Name";
    updateDto.description = "updated Desc";

    const response = await categoryService.updateCategoryInfo(
      savedCategory.getCategoryId,
      updateDto,
    );

    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedCateogry = await categoryService.getCategoryInfo(savedCategory.getCategoryId);
    expect(updatedCateogry.name).toBe("updated Name");
    expect(updatedCateogry.description).toBe("updated Desc");
  });
  it("Should Update Category Only Name", async () => {
    const savedCategory = new Category();
    savedCategory.setCategoryName = CategoryName;
    savedCategory.setCategoryDesc = CategoryDesc;
    savedCategory.setCategoryState = CategoryDefaultState;

    await categoryRepoditory.save(savedCategory);

    const updateDto = new CategoryUpdatedto();
    updateDto.name = "updated Name";

    const response = await categoryService.updateCategoryInfo(
      savedCategory.getCategoryId,
      updateDto,
    );

    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedCateogry = await categoryService.getCategoryInfo(savedCategory.getCategoryId);
    expect(updatedCateogry.name).toBe("updated Name");
  });

  it("Should Update Category Only Description", async () => {
    const savedCategory = new Category();
    savedCategory.setCategoryName = CategoryName;
    savedCategory.setCategoryDesc = CategoryDesc;
    savedCategory.setCategoryState = CategoryDefaultState;

    await categoryRepoditory.save(savedCategory);

    const updateDto = new CategoryUpdatedto();
    updateDto.description = "updated Desc";

    const response = await categoryService.updateCategoryInfo(
      savedCategory.getCategoryId,
      updateDto,
    );

    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedCateogry = await categoryService.getCategoryInfo(savedCategory.getCategoryId);
    expect(updatedCateogry.description).toBe("updated Desc");
  });

  it("Should Update menus in Category", async () => {
    const menu1 = new Menu();
    menu1.setMenuName = "menu1";
    menu1.setMenuPrice = 5000;
    await connection.manager.save(menu1);

    const menu2 = new Menu();
    menu2.setMenuName = "menu2"
    menu2.setMenuPrice = 4000;
    await connection.manager.save(menu2);

    const MenuList = [menu1, menu2];

    const savedCategory = new Category();
    savedCategory.setCategoryName = CategoryName;
    savedCategory.setCategoryDesc = CategoryDesc;
    savedCategory.setCategoryState = CategoryDefaultState;
    savedCategory.menus = MenuList;

    await categoryRepoditory.save(savedCategory);

    const updateDto = new CategoryMenuUpdateDto();
    updateDto.menus = [5,]; 

    const response = await categoryService.updateMenuInCategory(
      savedCategory.getCategoryId,
      updateDto,
    );

    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedCateogry = await categoryService.getCategoryInfo(savedCategory.getCategoryId);
    expect(updatedCateogry.menus).toStrictEqual([menu1]);
  });

  it("Should Update All", async () => {
    const menu1 = new Menu();
    menu1.setMenuName = "menu1";
    menu1.setMenuPrice = 5000;
    await connection.manager.save(menu1);

    const menu2 = new Menu();
    menu2.setMenuName = "menu2"
    menu2.setMenuPrice = 4000;
    await connection.manager.save(menu2);

    const MenuList = [menu1, menu2];

    const savedCategory = new Category();
    savedCategory.setCategoryName = CategoryName;
    savedCategory.setCategoryDesc = CategoryDesc;
    savedCategory.setCategoryState = CategoryDefaultState;
    savedCategory.menus = MenuList;

    await categoryRepoditory.save(savedCategory);

    const updateDtoInfo = new CategoryUpdatedto();
    updateDtoInfo.name = "updated Name";
    updateDtoInfo.description = "updated Desc";

    const responseInfo = await categoryService.updateCategoryInfo(
      savedCategory.getCategoryId,
      updateDtoInfo,
    );

    const updateDto = new CategoryMenuUpdateDto();
    updateDto.menus = [7,]; 

    const response = await categoryService.updateMenuInCategory(
      savedCategory.getCategoryId,
      updateDto,
    );

    expect(response).toBeInstanceOf(BasicMessageDto);
    expect(responseInfo).toBeInstanceOf(BasicMessageDto);

    const updatedCateogry = await categoryService.getCategoryInfo(savedCategory.getCategoryId);
    expect(updatedCateogry.name).toBe("updated Name");
    expect(updatedCateogry.description).toBe("updated Desc");
    expect(updatedCateogry.menus).toStrictEqual([menu1]); 
  });

  it("Should remove Category", async () => {
    const savedCategory = await saveCategory();

    const response = await categoryService.removeCategory(savedCategory.getCategoryId);
    expect(response).toBeInstanceOf(BasicMessageDto);

    const category = await categoryRepoditory.findOne(savedCategory.getCategoryId);
    expect(category).toBeUndefined();
  });
});
