import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BasicMessageDto } from 'src/common/dtos/basic-massage.dto';
import { Category } from 'src/entities/category/category.entity';
import { Menu } from 'src/entities/menu/menu.entity';
import { OptionGroup } from 'src/entities/option/optionGroup.entity';
import { createMemoryDB } from 'src/utils/connections/create-memory-db';
import { Connection, Repository } from 'typeorm';
import { MenuCreateDto } from './dtos/create-menu.dto';
import { MenuUpdateDto } from './dtos/update-menu.dto';
import { MenuService } from './menu.service';
import { InMemoryDBEntityAsyncController, InMemoryDBModule, InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { MenuEntity } from 'src/entities/menu/unittest.menu.entity';

// const mockMenuRepository = () => ({
//   MenuService :jest.fn(),
// });

describe('MenuService', () => {
  let menuService: MenuService;
  let connection: Connection;
  let menuRepository: Repository<MenuEntity>;

  const NAME= 'NAME';
  const PRICE = 5000;
  const DESC= 'vlvmdlvmrkm';
  const STATE= "true";
  //const MENU_ID=111;
 
  
  

  const saveMenu = async (): Promise<Menu> => {
    const savedMenu = new Menu();
    //savedMenu.setMenuId = MENU_ID;
    savedMenu.setMenuName = NAME;
    savedMenu.setMenuPrice = PRICE;
    savedMenu.setMenuDesc = DESC;
    savedMenu.setMenuState = STATE;
    

    return await menuRepository.save(savedMenu);
  };
  
  beforeAll(async () => {
    connection = await createMemoryDB([Menu]);
    menuRepository = await connection.getRepository(Menu);
    menuService = new MenuService(menuRepository);
  });

  afterAll(async () => {
    await connection.close();
  });
  afterEach(async () => {
    await menuRepository.query("DELETE FROM menus");
  });

  
  beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
          // { provide: getRepositoryToken(Menu), 
          //   useFactory: mockMenuRepository
          // },
        ],
      }).compile();

      menuService = await module.get<MenuService>(MenuService);
      
   });

  it('should be defined', () => {
    expect(menuService).toBeDefined();
  });

  it("Should Save Menu", async() => {
    const dto = new MenuCreateDto();
    //dto.menu_id=MENU_ID;
    dto.name = NAME;
    dto.price = PRICE;
    dto.description = DESC;
    dto.state = STATE;
    
   

    const responseDto = await menuService.saveMenu(dto);
    //expect(responseDto.menu_id).toBe(MENU_ID);
    expect(responseDto.name).toBe(NAME);
    expect(responseDto.price).toBe(PRICE);
    expect(responseDto.description).toBe(DESC);
    expect(responseDto.state).toBe(STATE);
    
    

    const savedMenu = await menuRepository.findOne(responseDto.menu_id);
    

    //expect(savedMenu.getMenu_id).toBe(responseDto.menu_id);
    expect(savedMenu.getMenuName).toBe(responseDto.name);
    expect(savedMenu.getMenuPrice).toBe(responseDto.price);
    expect(savedMenu.getMenuDesc).toBe(responseDto.description);
    expect(savedMenu.getMenuState).toBe(responseDto.state);
    
    // expect(savedMenu.getOption_group_id).toBe(responseDto.option_group_id);
    // expect(savedMenu.getEvent_group_id).toBe(responseDto.event_group_id);
    
  
  });

  it("Should not save menu and throw ConflictException", async () => {
    expect.assertions(1);

    const savedMenu = new Menu();
    savedMenu.setMenuName = NAME;
    savedMenu.setMenuPrice = PRICE;
    savedMenu.setMenuDesc = DESC;
    savedMenu.setMenuState = STATE;
    
  

    await menuRepository.save(savedMenu);

    const dto = new MenuCreateDto();
    dto.name = NAME;
    
    dto.price = PRICE;
    dto.description = DESC;
    dto.state = STATE;
    
  
  
    try {
      await menuService.saveMenu(dto);
    } catch (exception) {
      expect(exception).toBeInstanceOf(ConflictException);
    }
  });

  it("Should get user info correctly", async () => {
    let savedMenu = new Menu();
   
    savedMenu.setMenuName = NAME;
    savedMenu.setMenuPrice = PRICE;
    savedMenu.setMenuDesc = DESC;
    savedMenu.setMenuState = STATE;
    
    

    savedMenu = await menuRepository.save(savedMenu);
  
    const response = await menuService.getMenuInfo(savedMenu.getMenuId);
    
    expect(response.name).toBe(savedMenu.getMenuName);
    expect(response.price).toBe(savedMenu.getMenuPrice);
    expect(response.description).toBe(savedMenu.getMenuDesc);
    expect(response.state).toBe(savedMenu.getMenuState);
  
    
     
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
    const savedMenu = await saveMenu();

    const updateDto = new MenuUpdateDto();
    updateDto.name = "NEW_NAME";
    updateDto.price = 6000;
    updateDto.description = "NEW_DESC";
    updateDto.state = "false";

    const response = await menuService.updateMenuInfo(
      savedMenu.getMenuId,
      updateDto
    );
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedMenu = await menuRepository.findOne(savedMenu.getMenuId);
    expect(updatedMenu.getMenuName).toBe(updateDto.name);
    expect(updatedMenu.getMenuPrice).toBe(updateDto.price);
    expect(updatedMenu.getMenuDesc).toBe(updateDto.description);
    expect(updatedMenu.getMenuState).toBe(updateDto.state);
    
  });
//개별update테스트 
  it("Should update menu info(category_id)", async () => {
    const savedMenu = await saveMenu();

    const category1 = new Category();
    category1.setCategoryName = "CATEGORY1_NAME";
    category1.setCategoryDesc = "CATEGORY1_DESC";
    category1.setCategoryState = "CATEGORY1_STATE";
    
    const category2 = new Category();
    category1.setCategoryName = "CATEGORY2_NAME";
    category1.setCategoryDesc = "CATEGORY2_DESC";
    category1.setCategoryState = "CATEGORY2_STATE";

    const updateDto = new MenuUpdateDto();
    updateDto.categories = [category1,category2];
  

    const response = await menuService.updateCategory(
      savedMenu.getMenuId,
      updateDto,
      updateDto.categories
    );
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedMenu = await menuRepository.findOne(savedMenu.getMenuId);
    expect(updatedMenu.getCategories).toBe(updateDto.categories);
    //update되는 속성외 다른 속성을 그대로유지해주는 코드필요한지???
  });

  it("Should update menu info(option_group_id)", async () => {
    const savedMenu = await saveMenu();

    const optionGroup1 = new OptionGroup();
    optionGroup1.setOptionGroupName = "OPTIONGROUP1_NAME";
    optionGroup1.setOptionGroupDesc = "OPTIONGROUP1_DESC";
    optionGroup1.setOptionGroupState = "OPTIONGROUP1_STATE";

    const optionGroup2 = new OptionGroup();
    optionGroup2.setOptionGroupName = "OPTIONGROUP2_NAME";
    optionGroup2.setOptionGroupDesc = "OPTIONGROUP2_DESC";
    optionGroup2.setOptionGroupState = "OPTIONGROUP2_STATE";

    const updateDto = new MenuUpdateDto();
    updateDto.optionGroups = [optionGroup1, optionGroup2];

    const response = await menuService.updateOptionGroup(
      savedMenu.getMenuId,
      updateDto,
      updateDto.optionGroups
    );
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedMenu = await menuRepository.findOne(savedMenu.getMenuId);
    expect(updatedMenu.getOptionGroup).toBe(updateDto.optionGroups);
    //update되는 속성외 다른 속성을 그대로유지해주는 코드필요한지???
  });

  // it("Should update menu info(event_group_id)", async () => {
  //   const savedMenu = await saveMenu();

  //   const updateDto = new MenuUpdateDto();
  //   updateDto.event_group_id = 333;

  //   const response = await menuService.updateEventGroup(
  //     savedMenu.getMenu_id,
  //     updateDto,
  //     updateDto.event_group_id
  //   );
  //   expect(response).toBeInstanceOf(BasicMessageDto);
    

  //   const updatedMenu = await menuRepository.findOne(savedMenu.getMenu_id);
  //   expect(updatedMenu.getEvent_group_id).toBe(updateDto.event_group_id);
  //   //update되는 속성외 다른 속성을 그대로유지해주는 코드필요한지???ex.user.service.spec.ts의 Onlynameupdate.
  // });
  
//제거 테스트 전체제거, 개별제거

  it("Should remove menu(All)", async () => {
    const savedUser = await saveMenu();

    const response = await menuService.removeMenu(savedUser.getMenuId);
    expect(response).toBeInstanceOf(BasicMessageDto);

    const menu = await menuRepository.findOne(savedUser.getMenuId);
    expect(menu).toBeUndefined();
  });
//
  it("Should remove menu(categoryId)", async () => {
    const savedMenu = await saveMenu();
    const updateDto = new MenuUpdateDto();
    updateDto.categories=null;

    const response = await menuService.removeCategory(updateDto,savedMenu.getMenuId);
    expect(response).toBeInstanceOf(BasicMessageDto);

    const menu = await menuRepository.findOne(savedMenu.getMenuId);
    expect(menu).toBeUndefined();
  });
  
  it("Should remove menu(optiongroupId)", async () => {
    const savedMenu = await saveMenu();
    const updateDto = new MenuUpdateDto();
    updateDto.optionGroups=null;

    const response = await menuService.removeOptionGroup(updateDto, savedMenu.getMenuId);
    expect(response).toBeInstanceOf(BasicMessageDto);

    const menu = await menuRepository.findOne(savedMenu.getMenuId);
    expect(menu).toBeUndefined();
  });


  // it("Should remove menu(eventgroupId)", async () => {
  //   const savedMenu = await saveMenu();
  //   const updateDto = new MenuUpdateDto();
  //   updateDto.event_group_id=333;

  //   const response = await menuService.removeEventGroup(updateDto,savedMenu.getMenu_id);
  //   expect(response).toBeInstanceOf(BasicMessageDto);

  //   const menu = await menuRepository.findOne(savedMenu.getMenu_id);
  //   expect(menu).toBeUndefined();
  // });
});