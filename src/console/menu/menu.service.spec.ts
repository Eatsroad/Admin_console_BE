import { ConflictException, NotFoundException } from '@nestjs/common';
import { BasicMessageDto } from '../../../src/common/dtos/basic-massage.dto';
import { Category } from '../../../src/entities/category/category.entity';
import { Menu } from '../../../src/entities/menu/menu.entity';
import { Option } from '../../../src/entities/option/option.entity';
import { OptionGroup } from '../../../src/entities/option/optionGroup.entity';
import { Store } from '../../../src/entities/store/store.entity';
import { User } from '../../../src/entities/user/user.entity';
import { createMemoryDB } from '../../../src/utils/connections/create-memory-db';
import { Connection, Repository } from 'typeorm';
import { MenuCreateDto } from './dtos/create-menu.dto';
import { MenuUpdateDto } from './dtos/update-menu.dto';
import { MenuService } from './menu.service';
import { EnableTime } from '../../../src/entities/menu/enableTime.entity';
import { CategoryPreviewInfo } from '../category/dto/category-info.dto';
import { OptionGroupPreviewInfo } from '../optiongroup/dtos/optiongroup-info.dto';
import { MenuInfoResponseDto } from './dtos/menu-info.dto';


describe('MenuService', () => {
  let menuService: MenuService;
  let connection: Connection;
  let menuRepository: Repository<Menu>;

  const NAME= 'NAME';
  const PRICE = 5000;
  const DESC= 'vlvmdlvmrkm';
  const STATE= "true";
  const STOREID = null;

  const saveMenu = async (): Promise<Menu> => {
    const savedMenu = new Menu();
    savedMenu.setMenuName = NAME;
    savedMenu.setMenuPrice = PRICE;
    savedMenu.setMenuDesc = DESC;
    savedMenu.setMenuState = STATE;
    savedMenu.store_id = STOREID;
    return await menuRepository.save(savedMenu);
  };

  const MakeCategoryPreview = (categories:Category[]) : CategoryPreviewInfo[] => {
    let result : CategoryPreviewInfo[] = [];
    try{
      categories.forEach((category)=>{
        const data = {
          name : category.getCategoryName,
          category_id : category.getCategoryId
        };
        result.push(data);
      });
      return result;
    } catch(e){
      console.log(e);
    }
  } 

  const MakeOptionGroupPreview = (optionGroups:OptionGroup[]) : OptionGroupPreviewInfo[] => {
    let result : OptionGroupPreviewInfo[] = [];
    try{
      optionGroups.forEach((optiongroup)=>{
        const data = {
          name : optiongroup.getOptionGroupName,
          option_group_id : optiongroup.getOptionGroupId
        };
        result.push(data);
      });
      return result;
    } catch(e){
      console.log(e);
    }
  } 
  
  beforeAll(async () => {
    connection = await createMemoryDB([Menu, User, Store, Category, OptionGroup, Option, EnableTime]);
    menuRepository = await connection.getRepository(Menu);
    menuService = new MenuService(menuRepository);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should be defined', () => {
    expect(menuService).toBeDefined();
  });

  it("Should Save Menu", async () => {
    const store1 = new Store();
    store1.setName = "STORE1NAME";
    store1.setAddress = "STORE1ADDRESS";
    store1.setPhone_number = "1111";
    await connection.manager.save(store1);

    const dto = new MenuCreateDto();
    dto.name = NAME;
    dto.price = PRICE;
    dto.description = DESC;
    dto.state = STATE;
    dto.store_id = 1;

    const responseDto = await menuService.saveMenu(dto);

    expect(responseDto.name).toBe(NAME);
    expect(responseDto.price).toBe(PRICE);
    expect(responseDto.description).toBe(DESC);
    expect(responseDto.state).toBe(STATE);

    const savedMenu = await menuService.getMenuInfo(responseDto.menu_id);
    expect(savedMenu.name).toBe(responseDto.name);
    expect(savedMenu.price).toBe(responseDto.price);
    expect(savedMenu.description).toBe(responseDto.description);
    expect(savedMenu.state).toBe(responseDto.state);
  });

  it("Should not save menu and throw ConflictException", async () => {
    expect.assertions(1);

    const store1 = new Store();
    store1.setName = "df";
    store1.setTables = 10;
    store1.setPhone_number = "asdfasdf";
    store1.setAddress = "asdfasd";
    await connection.manager.save(store1);

    const savedMenu = new Menu();
    savedMenu.setMenuName = NAME;
    savedMenu.setMenuPrice = PRICE;
    savedMenu.setMenuDesc = DESC;
    savedMenu.setMenuState = STATE;
    savedMenu.store_id = store1;
    await menuRepository.save(savedMenu);

    const dto = new MenuCreateDto();
    dto.name = NAME;
    dto.price = PRICE;
    dto.description = DESC;
    dto.state = STATE;
    dto.store_id = 2;

    try {
      await menuService.saveMenu(dto);
    } catch (exception) {
      expect(exception).toBeInstanceOf(ConflictException);
    }
  });

  it("Should get menu info correctly", async () => {
    const store1 = new Store();
    store1.setName = "STORE1NAME";
    store1.setAddress = "STORE1ADDRESS";
    store1.setPhone_number = "1111";
    store1.setDeletedAt = null;
    store1.setUpdatedAt = null;
    await connection.manager.save(store1);

    let savedMenu = new Menu();
    savedMenu.setMenuName = NAME;
    savedMenu.setMenuPrice = PRICE;
    savedMenu.setMenuDesc = DESC;
    savedMenu.setMenuState = STATE;
    savedMenu.store_id = store1;
    await menuRepository.save(savedMenu);
  
    const response = await menuService.getMenuInfo(savedMenu.getMenuId);
    expect(response.name).toBe(savedMenu.getMenuName);
    expect(response.price).toBe(savedMenu.getMenuPrice);
    expect(response.description).toBe(savedMenu.getMenuDesc);
    expect(response.state).toBe(savedMenu.getMenuState);
  });

  it("Should get menu List correctly", async () => {
    const store1 = new Store();
    store1.setName = "STORE1NAME";
    store1.setAddress = "STORE1ADDRESS";
    store1.setPhone_number = "1111";
    store1.setDeletedAt = null;
    store1.setUpdatedAt = null;
    await connection.manager.save(store1);

    const category1 = new Category();
    category1.setCategoryName = "CATEGORY1NAME";
    category1.setCategoryDesc = "CATEGORY1DESC";
    await connection.manager.save(category1);
    const category2 = new Category();
    category2.setCategoryName = "CATEGORY2NAME";
    category2.setCategoryDesc = "CATEGORY2DESC";
    await connection.manager.save(category2);

    const categoryList = [category1, category2];

    const optionGroup1 = new OptionGroup();
    optionGroup1.setOptionGroupName = "OPTIONGROUP1NAME";
    optionGroup1.setOptionGroupDesc = "OPTIONGROUP1DESC";
    await connection.manager.save(optionGroup1);
    const optionGroup2 = new OptionGroup();
    optionGroup2.setOptionGroupName = "OPTIONGROUP2NAME";
    optionGroup2.setOptionGroupDesc = "OPTIONGROUP2DESC";
    await connection.manager.save(optionGroup2);

    const optionGroupList = [optionGroup1, optionGroup2];

    let savedMenu = new Menu();
    savedMenu.setMenuName = NAME;
    savedMenu.setMenuPrice = PRICE;
    savedMenu.setMenuDesc = DESC;
    savedMenu.setMenuState = STATE;
    savedMenu.store_id = store1;
    savedMenu.categories = categoryList;
    savedMenu.optionGroups = optionGroupList;
    await menuRepository.save(savedMenu);

    let savedMenuPreview = new MenuInfoResponseDto(savedMenu);
    savedMenuPreview.categories = MakeCategoryPreview(categoryList);
    savedMenuPreview.optionGroups = MakeOptionGroupPreview(optionGroupList);
    savedMenuPreview.name = NAME;
    savedMenuPreview.price = PRICE;
    savedMenuPreview.description = DESC;
    savedMenuPreview.state = STATE;
    

    const response = await menuService.getMenuList(savedMenu.store_id.getStore_id);
    expect(response).toStrictEqual([savedMenuPreview]);
  });

  it("Should throw NotFoundException if menu_id is invalid", async () => {
    expect.assertions(1);
    try {
      await menuService.getMenuInfo(-1);
    } catch (exception) {
      expect(exception).toBeInstanceOf(NotFoundException);
    }
  });

  it("Should update menu info(All)", async () => {
    const store2 = new Store();
    store2.setName = "STORE2NAME";
    store2.setPhone_number = "2222";
    store2.setAddress = "STORE2ADDRESS";
    await connection.manager.save(store2);

    const category2 = new Category();
    category2.setCategoryName = "CATEGORY2NAME";
    await connection.manager.save(category2);

    const category3 = new Category();
    category3.setCategoryName = "CATEGORY3NAME";
    await connection.manager.save(category3);

    const CategoryList = [category2, category3];

    const optiongroup2 = new OptionGroup();
    optiongroup2.setOptionGroupName = "OPTIONGROUP2";
    await connection.manager.save(optiongroup2);

    const optiongroup3 = new OptionGroup();
    optiongroup3.setOptionGroupName = "OPTIONGROUP3";
    await connection.manager.save(optiongroup3);

    const OptionGroupList = [optiongroup2, optiongroup3];

    const enabletime1 = new EnableTime();
    enabletime1.setEnableTimeDesc = "ENABLETIMEDESC";
    enabletime1.setStartTime = null;
    await connection.manager.save(enabletime1);

    const savedMenu = new Menu();
    savedMenu.setMenuName = NAME;
    savedMenu.setMenuPrice = PRICE;
    savedMenu.setMenuDesc = DESC;
    savedMenu.setMenuState = STATE;
    savedMenu.store_id = store2;
    savedMenu.categories = CategoryList;
    savedMenu.optionGroups = OptionGroupList;
    savedMenu.enable_time = enabletime1;
    
    await menuRepository.save(savedMenu);

    const updateDtoInfo = new MenuUpdateDto();
    updateDtoInfo.name = "UPDATED NAME";
    updateDtoInfo.description = "UPDATED DESC";
    updateDtoInfo.price = 10000;
    updateDtoInfo.state = "AVAILABLE";
    updateDtoInfo.store_id = 4;

    const responseInfo = await menuService.updateMenuInfo(
      savedMenu.getMenuId,
      updateDtoInfo
    );

    const updateDto = new MenuUpdateDto();
    updateDto.categories = [3,];
    updateDto.optionGroups = [3,];
    updateDto.enable_time = 1;

    const response = await menuService.updateCategoryInMenu(
      savedMenu.getMenuId,
      updateDto
    )
    
    const response2 = await menuService.updateOptionGroupInMenu(
      savedMenu.getMenuId,
      updateDto
    )

    const response3 = await menuService.updateEnableTimeInMenu(
      savedMenu.getMenuId,
      updateDto
    )
    
    expect(response).toBeInstanceOf(BasicMessageDto);
    expect(response2).toBeInstanceOf(BasicMessageDto);
    expect(response3).toBeInstanceOf(BasicMessageDto);
    expect(responseInfo).toBeInstanceOf(BasicMessageDto);
  
    
    const updatedMenu = await menuService.getMenuInfo(savedMenu.getMenuId);
    expect(updatedMenu.name).toBe("UPDATED NAME");
    expect(updatedMenu.price).toBe(10000);
    expect(updatedMenu.description).toBe("UPDATED DESC");
    expect(updatedMenu.state).toBe("AVAILABLE");
    expect(updatedMenu.categories).toStrictEqual(MakeCategoryPreview([category2,]));
    expect(updatedMenu.optionGroups).toStrictEqual(MakeOptionGroupPreview([optiongroup2,]));
    expect(updatedMenu.enable_time).toStrictEqual(enabletime1);
    
  });

  it("Should update menu info(MenuName)", async () => {
    const savedMenu = await saveMenu();

    const updateDto = new MenuUpdateDto();
    updateDto.name = "NEW_NAME";
  

    const response = await menuService.updateMenuInfo(
      savedMenu.getMenuId,
      updateDto
    );
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedMenu = await menuRepository.findOne(savedMenu.getMenuId);
    expect(updatedMenu.getMenuName).toBe("NEW_NAME");
  });

  it("Should update menu info(MenuState)", async () => {
    const savedMenu = await saveMenu();

    const updateDto = new MenuUpdateDto();
    updateDto.state = "NEW_STATE";
  

    const response = await menuService.updateMenuInfo(
      savedMenu.getMenuId,
      updateDto
    );
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedMenu = await menuRepository.findOne(savedMenu.getMenuId);
    expect(updatedMenu.getMenuState).toBe("NEW_STATE");
  });

  it("Should update menu info(MenuPrice)", async () => {
    const savedMenu = await saveMenu();

    const updateDto = new MenuUpdateDto();
    updateDto.price = 10000;
  

    const response = await menuService.updateMenuInfo(
      savedMenu.getMenuId,  
      updateDto
    );
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedMenu = await menuRepository.findOne(savedMenu.getMenuId);
    expect(updatedMenu.getMenuPrice).toBe(10000);
  });

  it("Should update menu info(MenuDesc)", async () => {
    const savedMenu = await saveMenu();

    const updateDto = new MenuUpdateDto();
    updateDto.description = "NEW_DESCRIPTION";
  

    const response = await menuService.updateMenuInfo(
      savedMenu.getMenuId,
      updateDto
    );
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedMenu = await menuRepository.findOne(savedMenu.getMenuId);
    expect(updatedMenu.getMenuDesc).toBe("NEW_DESCRIPTION");
  });

  
  it("Should update menu info(EnableTime)", async () => {
    const enabletime1 = new EnableTime();
    enabletime1.setEnableTimeDesc = "ENABLETIMEDESC";
    enabletime1.setStartTime = null;
    await connection.manager.save(enabletime1);

    const store3 = new Store();
    store3.setName = "STORE3NAME";
    store3.setPhone_number = "3333";
    store3.setAddress = "STORE3ADDRESS";
    await connection.manager.save(store3);

    const savedMenu = new Menu();
    savedMenu.setMenuName = NAME;
    savedMenu.setMenuDesc = DESC;
    savedMenu.setMenuPrice = PRICE;
    savedMenu.setMenuState = STATE;
    savedMenu.store_id = store3;
    savedMenu.enable_time = enabletime1;

    await menuRepository.save(savedMenu);

    const updateDtoInfo = new MenuUpdateDto();
    updateDtoInfo.enable_time = 2;

    const responseInfo = await menuService.updateEnableTimeInMenu(
    savedMenu.getMenuId,
      updateDtoInfo
    );

    expect(responseInfo).toBeInstanceOf(BasicMessageDto);
    
    const updatedMenu = await menuService.getMenuInfo(savedMenu.getMenuId);
    expect(updatedMenu.enable_time).toStrictEqual(enabletime1);
  });

  it("Should update menu info(Category)", async () => {
    const store3 = new Store();
    store3.setName = "STORE3NAME";
    store3.setPhone_number = "3333";
    store3.setAddress = "STORE3ADDRESS";
    await connection.manager.save(store3);

    const category2 = new Category();
    category2.setCategoryName = "CATEGORY2NAME";
    category2.setCategoryDesc = "CATEGORY2DESC";
    category2.setCategoryState = "CATEGORY2STATE";
    await connection.manager.save(category2);

    const category3 = new Category();
    category3.setCategoryName = "CATEGORY3NAME";
    category3.setCategoryDesc = "CATEGORY3DESC";
    category3.setCategoryState = "CATEGORY3STATE";
    await connection.manager.save(category3);

    const CategoryList = [category2, category3];

    const savedMenu = new Menu();
    savedMenu.setMenuName = NAME;
    savedMenu.setMenuDesc = DESC;
    savedMenu.setMenuPrice = PRICE;
    savedMenu.setMenuState = STATE;
    savedMenu.store_id = store3;
    savedMenu.categories = CategoryList;

    await menuRepository.save(savedMenu);

    const updateDtoInfo = new MenuUpdateDto();
    updateDtoInfo.categories = [5,];

    const responseInfo = await menuService.updateCategoryInMenu(
      savedMenu.getMenuId,
      updateDtoInfo
    )

    expect(responseInfo).toBeInstanceOf(BasicMessageDto);

    const updatedMenu = await menuService.getMenuInfo(savedMenu.getMenuId);
    expect(updatedMenu.categories).toStrictEqual(MakeCategoryPreview([category2,]));
  });

  it("Should update menu info(OptionGroup)", async () => {
    const store3 = new Store();
    store3.setName = "STORE3NAME";
    store3.setPhone_number = "3333";
    store3.setAddress = "STORE3ADDRESS";
    await connection.manager.save(store3);

    const optiongroup2 = new OptionGroup();
    optiongroup2.setOptionGroupName = "OPTIONGROUP2";
    optiongroup2.setOptionGroupDesc = "OPTIONGRUOP2DESC";
    optiongroup2.setOptionGroupState = "OPTIONGROUP2STATE";
    await connection.manager.save(optiongroup2);

    const optiongroup3 = new OptionGroup();
    optiongroup3.setOptionGroupName = "OPTIONGROUP3";
    optiongroup3.setOptionGroupDesc = "OPTIONGRUOP3DESC";
    optiongroup3.setOptionGroupState = "OPTIONGROUP3STATE";
    await connection.manager.save(optiongroup3);

    const OptionGroupList = [optiongroup2, optiongroup3]; 

    const savedMenu = new Menu();
    savedMenu.setMenuName = NAME;
    savedMenu.setMenuDesc = DESC;
    savedMenu.setMenuPrice = PRICE;
    savedMenu.setMenuState = STATE;
    savedMenu.store_id = store3;
    savedMenu.optionGroups = OptionGroupList;

    await menuRepository.save(savedMenu);

    const updateDtoInfo = new MenuUpdateDto();
    updateDtoInfo.optionGroups = [5,];

    const responseInfo = await menuService.updateOptionGroupInMenu(
    savedMenu.getMenuId,
      updateDtoInfo
    );

    expect(responseInfo).toBeInstanceOf(BasicMessageDto);

    const updatedMenu = await menuService.getMenuInfo(savedMenu.getMenuId);
    expect(updatedMenu.optionGroups).toStrictEqual(MakeOptionGroupPreview([optiongroup2,]));
  });



  it("Should remove menu(All)", async () => {
    const savedMenu = await saveMenu();

    const response = await menuService.removeMenu(savedMenu.getMenuId);
    expect(response).toBeInstanceOf(BasicMessageDto);

    const menu = await menuRepository.findOne(savedMenu.getMenuId);
    expect(menu).toBeUndefined();
  });

  it("Should remove menu(MenuDesc)", async () => {
    const savedMenu = await saveMenu();
    const updateDto = new MenuUpdateDto();
    updateDto.description=null;

    const response = await menuService.updateMenuInfo(savedMenu.getMenuId, updateDto);
    expect(response).toBeInstanceOf(BasicMessageDto);

    const menu = await menuRepository.findOne(savedMenu.getMenuId);
    expect(menu.getMenuDesc).toBe(null);
  });

  it("Should remove menu(MenuState)", async () => {
    const savedMenu = await saveMenu();
    const updateDto = new MenuUpdateDto();
    updateDto.state = null;

    const response = await menuService.updateMenuInfo(savedMenu.getMenuId, updateDto);
    expect(response).toBeInstanceOf(BasicMessageDto);

    const menu = await menuRepository.findOne(savedMenu.getMenuId);
    expect(menu.getMenuState).toBe(null);
  });

  it("Should remove menu(EnableTime)", async () => {
    const savedMenu = await saveMenu();
    const response = await menuService.removeEnableTimeInMenu(savedMenu.getMenuId);
    expect(response).toBeInstanceOf(BasicMessageDto);

    const menu = await menuRepository.findOne(savedMenu.getMenuId);
    expect(menu.enable_time).toBeUndefined();
  });

});