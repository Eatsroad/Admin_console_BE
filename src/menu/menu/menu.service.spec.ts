import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BasicMessageDto } from 'src/common/dtos/basic-massage.dto';
import { Menu } from 'src/entities/menu/menu.entity';
import { createMemoryDB } from 'src/utils/connections/create-memory-db';
import { Connection, Repository } from 'typeorm';
import { MenuCreateDto } from './dtos/create-menu.dto';
import { MenuUpdateDto } from './dtos/update-menu.dto';
import { MenuService } from './menu.service';

describe('MenuService', () => {
  let menuService: MenuService;
  let connection: Connection;
  let menuRepository: Repository<Menu>;

  const NAME= 'NAME';
  const PRICE = 5000;
  const DESC= 'vlvmdlvmrkm';
  const STATE= true;
  const CATEGORY_ID= 333;
  const OPTION_GROUP_ID=222;
  const EVENT_GROUP_ID=111;

  const saveMenu = async (): Promise<Menu> => {
    const savedMenu = new Menu();
    savedMenu.setName = NAME;
    savedMenu.setPrice = PRICE;
    savedMenu.setDesc = DESC;
    savedMenu.setState = STATE;
    savedMenu.setCategory_id = CATEGORY_ID;
    savedMenu.setOption_group_id = OPTION_GROUP_ID;
    savedMenu.setEvent_group_id = EVENT_GROUP_ID;

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

  
  // beforeEach(async () => {
  //    const module: TestingModule = await Test.createTestingModule({
  //      providers: [MenuService],
  //    }).compile();

  //    menuService = module.get<MenuService>(MenuService);
  // });

  it('should be defined', () => {
    expect(menuService).toBeDefined();
  });
  it("Should Save Menu", async() => {
    const dto = new MenuCreateDto();
    dto.name = NAME;
    dto.price = PRICE;
    dto.desc = DESC;
    dto.state = STATE;
    dto.category_id=CATEGORY_ID;
    dto.event_group_id=EVENT_GROUP_ID;
    dto.option_group_id=OPTION_GROUP_ID;

    const responseDto = await menuService.saveMenu(dto);

    expect(responseDto.name).toBe(NAME);
    expect(responseDto.price).toBe(PRICE);
    expect(responseDto.desc).toBe(DESC);
    expect(responseDto.state).toBe(STATE);
    expect(responseDto.category_id).toBe(CATEGORY_ID);
    expect(responseDto.event_group_id).toBe(EVENT_GROUP_ID);
    expect(responseDto.option_group_id).toBe(OPTION_GROUP_ID);

    const savedMenu = await menuRepository.findOne(responseDto.menu_id);
    //const savedMenu = await menuRepository.findOne(responseDto.category_id);
    //const savedMenu = await menuRepository.findOne(responseDto.option_group_id);
    //const savedMenu = await menuRepository.findOne(responseDto.event_group_id);

    expect(savedMenu.getMenu_id).toBe(responseDto.menu_id);
    expect(savedMenu.getName).toBe(responseDto.name);
    expect(savedMenu.getPrice).toBe(responseDto.price);
    expect(savedMenu.getDesc).toBe(responseDto.desc);
    expect(savedMenu.getState).toBe(responseDto.state);
    expect(savedMenu.getCategory_id).toBe(responseDto.category_id);
    expect(savedMenu.getOption_group_id).toBe(responseDto.option_group_id);
    expect(savedMenu.getEvent_group_id).toBe(responseDto.event_group_id);
    
  
  });

  it("Should not save menu and throw ConflictException", async () => {
    expect.assertions(1);

    const savedMenu = new Menu();
    
    savedMenu.setName = NAME;
    savedMenu.setPrice = PRICE;
    savedMenu.setDesc = DESC;
    savedMenu.setCategory_id = CATEGORY_ID;
    savedMenu.setEvent_group_id = EVENT_GROUP_ID;
    savedMenu.setOption_group_id = OPTION_GROUP_ID;

    await menuRepository.save(savedMenu);

    const dto = new MenuCreateDto();
    dto.name = NAME;
    dto.price = PRICE;
    dto.desc = DESC;
    dto.state = STATE;
    dto.category_id = CATEGORY_ID;
    dto.event_group_id = EVENT_GROUP_ID;
    dto.option_group_id = OPTION_GROUP_ID;
  
    try {
      await menuService.saveMenu(dto);
    } catch (exception) {
      expect(exception).toBeInstanceOf(ConflictException);
    }
  });

  it("Should get user info correctly", async () => {
    let savedMenu = new Menu();
    savedMenu.setName = NAME;
    savedMenu.setPrice = PRICE;
    savedMenu.setDesc = DESC;
    savedMenu.setState = STATE;
    savedMenu.setCategory_id = CATEGORY_ID;
    savedMenu.setEvent_group_id = EVENT_GROUP_ID;
    savedMenu.setOption_group_id = OPTION_GROUP_ID;

    savedMenu = await menuRepository.save(savedMenu);
  
    const response = await menuService.getMenuInfo(savedMenu.getMenu_id);
    expect(response.menu_id).toBe(savedMenu.getMenu_id);
    expect(response.price).toBe(savedMenu.getPrice);
    expect(response.desc).toBe(savedMenu.getDesc);
    expect(response.state).toBe(savedMenu.getState);
    expect(response.category_id).toBe(savedMenu.getCategory_id);
    expect(response.event_group_id).toBe(savedMenu.getEvent_group_id);
    expect(response.option_group_id).toBe(savedMenu.getOption_group_id);
  });

  it("Should throw NotFoundException if menu_id is invalid", async () => {
    expect.assertions(1);
    try {
      await menuService.getMenuInfo(-1);
    } catch (exception) {
      expect(exception).toBeInstanceOf(NotFoundException);
    }
  });

  it("Should update user infos(All)", async () => {
    const savedMenu = await saveMenu();

    const updateDto = new MenuUpdateDto();
    updateDto.name = "NEW_NAME";
    updateDto.price = 6000;
    updateDto.desc = "NEW_DESC";
    updateDto.state = false;
    updateDto.category_id = 111;
    updateDto.event_group_id = 222;
    updateDto.option_group_id = 333;


    const response = await menuService.updateMenuInfo(
      savedMenu.getMenu_id,
      updateDto
    );

    expect(response).toBeInstanceOf(BasicMessageDto);//뭘까??

    const updatedUser = await menuRepository.findOne(savedMenu.getMenu_id);
    expect(updatedUser.getName).toBe("NEW_NAME");
    expect(updatedUser.getPrice).toBe(updateDto.price);
    expect(updatedUser.getDesc).toBe(updateDto.desc);
    expect(updatedUser.getState).toBe(updateDto.state);
    expect(updatedUser.getCategory_id).toBe(updateDto.category_id);
    expect(updatedUser.getEvent_group_id).toBe(updateDto.event_group_id);
    expect(updatedUser.getOption_group_id).toBe(updateDto.option_group_id);
  });
  it("Should update menu info(name,price,desc,state)", async () => {
    const savedMenu = await saveMenu();

    const updateDto = new MenuUpdateDto();
    updateDto.name = "NEW_NAME";
    updateDto.price = 6000;
    updateDto.desc = "NEW_DESC";
    updateDto.state = false;
//updateDto.category_id=111;

    const response = await menuService.updateMenuInfo(
      savedMenu.getMenu_id,
      updateDto
    );
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedMenu = await menuRepository.findOne(savedMenu.getMenu_id);
    expect(updatedMenu.getName).toBe("NEW_NAME");
    expect(updatedMenu.getPrice).toBe(updateDto.price);
    expect(updatedMenu.getDesc).toBe(updateDto.desc);
    expect(updatedMenu.getState).toBe(updateDto.state);
    
  });
/*
  it("Should update menu info(category_id)", async () => {
    const savedUser = await saveMenu();

    const updateDto = new UserUpdateDto();
    updateDto.name = "NEW_NAME";

    const response = await userService.updateUserInfo(
      savedUser.getUser_id,
      updateDto
    );
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedUser = await userRepository.findOne(savedUser.getUser_id);
    expect(updatedUser.getName).toBe("NEW_NAME");
    expect(updatedUser.getPassword).toBe(PASSWORD);
  });

  it("Should update menu info(option_group_id)", async () => {
    const savedUser = await saveUser();

    const updateDto = new UserUpdateDto();
    updateDto.password = "NEW_PASSWORD";

    const response = await userService.updateUserInfo(
      savedUser.getUser_id,
      updateDto
    );
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedUser = await userRepository.findOne(savedUser.getUser_id);
    expect(updatedUser.getName).toBe(NAME);
    expect(updatedUser.getPassword).toBe("NEW_PASSWORD");
  });

  it("Should update menu info(event_group_id)", async () => {
    const savedUser = await saveUser();

    const updateDto = new UserUpdateDto();
    updateDto.password = "NEW_PASSWORD";

    const response = await userService.updateUserInfo(
      savedUser.getUser_id,
      updateDto
    );
    expect(response).toBeInstanceOf(BasicMessageDto);
    */

    const updatedUser = await userRepository.findOne(savedUser.getUser_id);
    expect(updatedUser.getName).toBe(NAME);
    expect(updatedUser.getPassword).toBe("NEW_PASSWORD");
  });


  it("Should remove menu", async () => {
    const savedUser = await saveMenu();

    const response = await menuService.removeMenu(savedUser.getMenu_id);
    expect(response).toBeInstanceOf(BasicMessageDto);

    const menu = await menuRepository.findOne(savedUser.getMenu_id);
    expect(menu).toBeUndefined();
  });
});
