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


describe('MenuService', () => {
  let menuService: MenuService;
  let connection: Connection;
  let menuRepository: Repository<Menu>;

  const NAME= 'NAME';
  const PRICE = 5000;
  const DESC= 'vlvmdlvmrkm';
  const STATE= "true";
  const store1= new Store();
  store1.setName = "STORENAME";
  store1.setPhone_number = "01000000000";
  store1.setAddress = "STOREADDRESS";
  store1.setIsApproved = true;
  store1.setTables = 4;
  const STOREID = store1;

  const saveMenu = async (): Promise<Menu> => {
    const savedMenu = new Menu();
    savedMenu.setMenuName = NAME;
    savedMenu.setMenuPrice = PRICE;
    savedMenu.setMenuDesc = DESC;
    savedMenu.setMenuState = STATE;
    savedMenu.store_id = STOREID;
    return await menuRepository.save(savedMenu);
  };
  
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
    const dto = new MenuCreateDto();
    dto.name = NAME;
    dto.price = PRICE;
    dto.description = DESC;
    dto.state = STATE;
    dto.store_id = STOREID;

    const responseDto = await menuService.saveMenu(dto);
    expect(responseDto.name).toBe(NAME);
    expect(responseDto.price).toBe(PRICE);
    expect(responseDto.description).toBe(DESC);
    expect(responseDto.state).toBe(STATE);
    expect(responseDto.store_id).toBe(STOREID);

    const savedMenu = await menuRepository.findOne(responseDto.menu_id);
    expect(savedMenu.getMenuName).toBe(responseDto.name);
    expect(savedMenu.getMenuPrice).toBe(responseDto.price);
    expect(savedMenu.getMenuDesc).toBe(responseDto.description);
    expect(savedMenu.getMenuState).toBe(responseDto.state);
    expect(savedMenu.store_id).toBe(responseDto.store_id);
  });

  it("Should not save menu and throw ConflictException", async () => {
    expect.assertions(1);

    const savedMenu = new Menu();
    savedMenu.setMenuName = NAME;
    savedMenu.setMenuPrice = PRICE;
    savedMenu.setMenuDesc = DESC;
    savedMenu.setMenuState = STATE;
    savedMenu.setStoreId = STOREID;
    await menuRepository.save(savedMenu);

    const dto = new MenuCreateDto();
    dto.name = NAME;
    dto.price = PRICE;
    dto.description = DESC;
    dto.state = STATE;
    dto.store_id = STOREID;
    try {
      await menuService.saveMenu(dto);
    } catch (exception) {
      expect(exception).toBeInstanceOf(ConflictException);
    }
  });

  it("Should get menu info correctly", async () => {
    let savedMenu = new Menu();
    savedMenu.setMenuName = NAME;
    savedMenu.setMenuPrice = PRICE;
    savedMenu.setMenuDesc = DESC;
    savedMenu.setMenuState = STATE;
    savedMenu.store_id = STOREID;
    savedMenu = await menuRepository.save(savedMenu);
  
    const response = await menuService.getMenuInfo(savedMenu.getMenuId);
    expect(response.name).toBe(savedMenu.getMenuName);
    expect(response.price).toBe(savedMenu.getMenuPrice);
    expect(response.description).toBe(savedMenu.getMenuDesc);
    expect(response.state).toBe(savedMenu.getMenuState);
    expect(response.store_id).toBe(savedMenu.store_id);
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
    const store2 = new Store();
    store1.setName = "STORENAME2";
    store1.setPhone_number = "01000000002";
    store1.setAddress = "STOREADDRESS2";
    store1.setIsApproved = false;
    store1.setTables = 5;
    store1.setUpdatedAt = null;
    store1.setDeletedAt = null;
    updateDto.store_id = store2;
    
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
    expect(updatedMenu.store_id).toBe(updateDto.store_id);
    
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
  
  // it("Should update menu info(StoreId)", async () => {
  //   const savedMenu = await saveMenu();

  //   const updateDto = new MenuUpdateDto();
  //   // const store3 = new Store();
  //   // store1.setName = "STORENAME3";
  //   // store1.setPhone_number = "01000000003";
  //   // store1.setAddress = "STOREADDRESS3";
  //   // store1.setIsApproved = false;
  //   // store1.setTables = 6;
  //   // store1.setUpdatedAt = null;
  //   // store1.setDeletedAt = null;
  //   // updateDto.store_id = store3;
  

  //   const response = await menuService.updateMenuInfo(
  //     savedMenu.getMenuId,
  //     updateDto
  //   );
  //   expect(response).toBeInstanceOf(BasicMessageDto);

  //   const updatedMenu = await menuRepository.findOne(savedMenu.getMenuId);
  //   expect(updatedMenu.store_id).toBe(store3);
  // });

  it("Should remove menu(All)", async () => {
    const savedUser = await saveMenu();

    const response = await menuService.removeMenu(savedUser.getMenuId);
    expect(response).toBeInstanceOf(BasicMessageDto);

    const menu = await menuRepository.findOne(savedUser.getMenuId);
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

});