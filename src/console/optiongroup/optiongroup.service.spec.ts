import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BasicMessageDto } from '../../../src/common/dtos/basic-massage.dto';
import { OptionGroup } from '../../../src/entities/option/optionGroup.entity';
import { createMemoryDB } from '../../../src/utils/connections/create-memory-db';
import { Connection, Repository } from 'typeorm';
import { OptionGroupCreateDto } from './dtos/create-optiongroup.dto';
import { OptionGroupUpdateDto } from './dtos/update-optiongroup.dto';
import { OptiongroupService } from './optiongroup.service';
import { Option } from '../../../src/entities/option/option.entity';
import { OptionPreviewInfo } from '../option/dtos/option-info.dto';
import { Menu } from '../../../src/entities/menu/menu.entity';
import { Store } from '../.../../../../src/entities/store/store.entity';
import { User } from '../../../src/entities/user/user.entity';
import { EnableTime } from '../../../src/entities/menu/enableTime.entity';
import { Category } from '../../../src/entities/category/category.entity';
import { MenuPreviewInfo } from '../menu/dtos/menu-info.dto';
import { OptionGroupInfoResponseDto } from './dtos/optiongroup-info.dto';

describe('OptiongroupService', () => {
  let optionGroupService: OptiongroupService;
  let connection : Connection;
  let optionGroupRepository: Repository<OptionGroup>;
  
  const NAME = "OPTIONGROUPNAME";
  const DESC = "OPTIONGROUPDESC";
  const STATE = "OPTIONGROUPSTATE";
  const OPTIONID = null;

  const saveOptionGroup = async () : Promise<OptionGroup> => {
    const savedOptionGroup = new OptionGroup();
    savedOptionGroup.setOptionGroupName = NAME;
    savedOptionGroup.setOptionGroupDesc = DESC;
    savedOptionGroup.setOptionGroupState = STATE;
    savedOptionGroup.option_id = OPTIONID;
    return await optionGroupRepository.save(savedOptionGroup);
  }

  const MakeOptionPreview = (options:Option[]) : OptionPreviewInfo[] => {
    let result : OptionPreviewInfo[] = [];
    try{
      options.forEach((option)=>{
        const data = {
          name : option.getOptionName,
          option_id : option.getOptionId
        };
        result.push(data);
      });
      return result;
    } catch(e){
      console.log(e);
    }
  } 

  const MakeMenuPreview = (menus: Menu[]): MenuPreviewInfo[] => {
    let result : MenuPreviewInfo[] = [];
    try{
      menus.forEach((menu) => {
        const data = {
          name: menu.getMenuName,
          menu_id: menu.getMenuId
        };
        result.push(data);
      });
      return result;
    } catch(e){
      console.log(e);
    }
  }

  beforeAll(async () => {
    connection = await createMemoryDB([OptionGroup, Option, Menu, Store, User, EnableTime, Category]);
    optionGroupRepository = await connection.getRepository(OptionGroup);
    optionGroupService = new OptiongroupService(optionGroupRepository);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should be defined', () => {
    expect(optionGroupService).toBeDefined();
  });

  it("Should Save OptionGroup", async () => {

    const store1 = new Store();
    store1.setName = "STORENAME";
    store1.setAddress = "STOREADDRESS";
    store1.setPhone_number = "0101101010";
    await connection.manager.save(store1);
    const store_code = Buffer.from(String(store1.getStore_id),"binary").toString("base64");

    const dto = new OptionGroupCreateDto();
    dto.name = NAME;
    dto.description = DESC;
    dto.state = STATE;
    
    const responseDto = await optionGroupService.saveOptionGroup(dto, store_code);
    expect(responseDto.name).toBe(NAME);
    expect(responseDto.description).toBe(DESC);
    expect(responseDto.state).toBe(STATE);
  
    const savedOptionGroup = await optionGroupService.getOptiongroupInfo(responseDto.option_group_id);
    expect(savedOptionGroup.name).toBe(responseDto.name);
    expect(savedOptionGroup.description).toBe(responseDto.description);
    expect(savedOptionGroup.state).toBe(responseDto.state);

  });

  it("Should not save optionGroup and throw ConflictException", async () => {
    expect.any(ConflictException);

    const store1 = new Store();
    store1.setName = "STORENAME";
    store1.setAddress = "STOREADDRESS";
    store1.setPhone_number = "0101101010";
    await connection.manager.save(store1);
    const store_code = Buffer.from(String(store1.getStore_id),"binary").toString("base64");

    const savedOptionGroup = new OptionGroup();
    savedOptionGroup.setOptionGroupName = NAME;
    savedOptionGroup.setOptionGroupDesc = DESC;
    savedOptionGroup.setOptionGroupState = STATE;
    savedOptionGroup.store = store1;
    await optionGroupRepository.save(savedOptionGroup);

    const dto = new OptionGroupCreateDto();
    dto.name = NAME;
    dto.description = DESC;
    dto.state = STATE;

    try {
      await optionGroupService.saveOptionGroup(dto, store_code);
    } catch (exception) {
      expect(exception).toBeInstanceOf(ConflictException);
    }
  });

  it("Should get optionGroup info correctly", async () => {
    const option1 = new Option();
    option1.setOptionName = "NAME";
    option1.setOptionPrice = 500;
    option1.setOptionState = "STATE";
    await connection.manager.save(option1);

    const option2 = new Option();
    option2.setOptionName = "NAME2";
    option2.setOptionPrice = 500;
    option2.setOptionState = "STATE2";
    await connection.manager.save(option2);

    const OptionList = [option1, option2];

    const store1 = new Store();
    store1.setName = "STORENAME";
    store1.setAddress = "STOREADDRESS";
    store1.setPhone_number = "0101101010";
    await connection.manager.save(store1);

    const menu1 = new Menu();
    menu1.setMenuName = "MENUNAME1";
    menu1.setMenuPrice = 10000;
    await connection.manager.save(menu1);

    const menu2 = new Menu();
    menu2.setMenuName = "MENUNAME2";
    menu2.setMenuPrice = 10000;
    await connection.manager.save(menu2);

    const menuList = [menu1, menu2];

    let savedOptionGroup = new OptionGroup();
    savedOptionGroup.setOptionGroupName = NAME;
    savedOptionGroup.setOptionGroupDesc = DESC;
    savedOptionGroup.setOptionGroupState = STATE;
    savedOptionGroup.option_id = OptionList;
    savedOptionGroup.store = store1;
    savedOptionGroup.menus = menuList;
    await optionGroupRepository.save(savedOptionGroup);

    const response = await optionGroupService.getOptiongroupInfo(savedOptionGroup.getOptionGroupId);
    
    expect(response.name).toBe(savedOptionGroup.getOptionGroupName);
    expect(response.description).toBe(savedOptionGroup.getOptionGroupDesc);
    expect(response.state).toBe(savedOptionGroup.getOptionGroupState);
    expect(response.option_id).toStrictEqual(savedOptionGroup.getOptionsPreviewInfo);
    expect(response.menus).toStrictEqual(savedOptionGroup.getMenusPreviewInfo);
  });

  it("Should get optionGroup List correctly", async () => {
    const store1 = new Store();
    store1.setName = "STORE1NAME";
    store1.setAddress = "STORE1ADDRESS";
    store1.setPhone_number = "1111";
    store1.setDeletedAt = null;
    store1.setUpdatedAt = null;
    await connection.manager.save(store1);
    const store_code = Buffer.from(String(store1.getStore_id),"binary").toString("base64");

    const option1 = new Option();
    option1.setOptionName = "NAME";
    option1.setOptionPrice = 500;
    option1.setOptionState = "STATE";
    await connection.manager.save(option1);
    const option2 = new Option();
    option2.setOptionName = "NAME2";
    option2.setOptionPrice = 500;
    option2.setOptionState = "STATE2";
    await connection.manager.save(option2);

    const OptionList = [option1, option2];

    const menu1 = new Menu();
    menu1.store_id = store1;
    menu1.setMenuName = "MENU1NAME";
    menu1.setMenuPrice = 50000;
    await connection.manager.save(menu1);

    const menu2 = new Menu();
    menu2.store_id = store1;
    menu2.setMenuName = "MENU2NAME";
    menu2.setMenuPrice = 5000;
    
    await connection.manager.save(menu2);

    const menuList = [menu1, menu2];

    let savedOptionGroup = new OptionGroup();
    savedOptionGroup.setOptionGroupName = NAME;
    savedOptionGroup.setOptionGroupDesc = DESC;
    savedOptionGroup.setOptionGroupState = STATE;
    savedOptionGroup.option_id = OptionList;
    savedOptionGroup.menus= menuList;
    savedOptionGroup.store = store1;
    await optionGroupRepository.save(savedOptionGroup);
    
    let savedOptionGroupPreview = new OptionGroupInfoResponseDto(savedOptionGroup);
    savedOptionGroupPreview.option_id = MakeOptionPreview(OptionList);
    savedOptionGroupPreview.name = NAME;
    savedOptionGroupPreview.menus = MakeMenuPreview(menuList);
    savedOptionGroupPreview.description = DESC;
    savedOptionGroupPreview.state = STATE;
    
    const response = await optionGroupService.getAllOptionGroupList(store_code);
  
    expect(response[0].name).toBe(savedOptionGroupPreview.name);
    expect(response[0].option_group_id).toBe(savedOptionGroupPreview.option_group_id);
    expect(response[0].description).toBe(savedOptionGroupPreview.description);
    expect(response[0].state).toBe(savedOptionGroupPreview.state);
    expect(response[0].menus).toStrictEqual(savedOptionGroupPreview.menus);
    expect(response[0].option_id).toStrictEqual(savedOptionGroupPreview.option_id);
  });

  it("Should throw NotFoundException if option_group_id is invalid", async () => {
    expect.assertions(1);
    try {
      await optionGroupService.getOptiongroupInfo(-1);
    } catch (exception) {
      expect(exception).toBeInstanceOf(NotFoundException);
    }
  });

  it("Should update optiongroup info(All)", async () => {
    const store1 = new Store();
    store1.setName = "STORENAME";
    store1.setAddress = "STOREADDRESS";
    store1.setPhone_number = "0101101010";
    await connection.manager.save(store1);
    const store_code = Buffer.from(String(store1.getStore_id),"binary").toString("base64");

    const menu1 = new Menu();
    menu1.setMenuName = "MENUNAME";
    menu1.setMenuPrice = 10000;
    await connection.manager.save(menu1);

    const menu2 = new Menu();
    menu2.setMenuName = "MENU2NAME";
    menu2.setMenuPrice = 10000;
    await connection.manager.save(menu2);

    const menuList = [menu1, menu2];

    const option1 = new Option();
    option1.setOptionName = "NAME";
    option1.setOptionPrice = 500;
    option1.setOptionState = "STATE";
    await connection.manager.save(option1);

    const option2 = new Option();
    option2.setOptionName = "NAME2";
    option2.setOptionPrice = 500;
    option2.setOptionState = "STATE2";
    await connection.manager.save(option2);

    const OptionList = [option1, option2];

    const savedOptionGroup = new OptionGroup();
    savedOptionGroup.setOptionGroupName = NAME;
    savedOptionGroup.setOptionGroupDesc = DESC;
    savedOptionGroup.setOptionGroupState = STATE;
    savedOptionGroup.option_id = OptionList;
    savedOptionGroup.menus = menuList;

    await optionGroupRepository.save(savedOptionGroup);

    const updateDtoInfo = new OptionGroupUpdateDto();
    updateDtoInfo.name = "UPDATED NAME";
    updateDtoInfo.state = "UPDATED STATE";
    updateDtoInfo.description = "UPDATED DESC";
    
    const responseInfo = await optionGroupService.updateOptiongroupInfo(
      savedOptionGroup.getOptionGroupId,
      updateDtoInfo,
      store_code
    );

    const updateDto = new OptionGroupUpdateDto();
    updateDto.option_id = [5,];
    updateDto.menus = [5,];

    const response = await optionGroupService.updateOptionInOptionGroup(
      savedOptionGroup.getOptionGroupId,
      updateDto
    )
    const response2 = await optionGroupService.updateMenuInOptionGroup(
      savedOptionGroup.getOptionGroupId,
      updateDto
    )

    expect(responseInfo).toBeInstanceOf(BasicMessageDto);
    expect(response).toBeInstanceOf(BasicMessageDto);
    expect(response2).toBeInstanceOf(BasicMessageDto);

    const updatedOptionGroup = await optionGroupService.getOptiongroupInfo(savedOptionGroup.getOptionGroupId);
    expect(updatedOptionGroup.name).toBe("UPDATED NAME");
    expect(updatedOptionGroup.description).toBe("UPDATED DESC");
    expect(updatedOptionGroup.state).toBe("UPDATED STATE");
    expect(updatedOptionGroup.option_id).toStrictEqual(MakeOptionPreview([option1,]));
    expect(updatedOptionGroup.menus).toStrictEqual(MakeMenuPreview([menu1,]));
  });

  it("Should update optiongroup info(OptionGroupName)", async () => {
    const store1 = new Store();
    store1.setName = "STORENAME";
    store1.setAddress = "STOREADDRESS";
    store1.setPhone_number = "0101101010";
    await connection.manager.save(store1);
    const store_code = Buffer.from(String(store1.getStore_id),"binary").toString("base64");

    const savedOptiongroup = await saveOptionGroup();

    const updateDto = new OptionGroupUpdateDto();
    updateDto.name = "NEW_NAME";
  

    const response = await optionGroupService.updateOptiongroupInfo(
      savedOptiongroup.getOptionGroupId,
      updateDto,
      store_code
    );
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedOptionGroup = await optionGroupRepository.findOne(savedOptiongroup.getOptionGroupId);
    expect(updatedOptionGroup.getOptionGroupName).toBe("NEW_NAME");
  });

  it("Should update optiongroup info(OptionGroupDesc)", async () => {
    const store1 = new Store();
    store1.setName = "STORENAME";
    store1.setAddress = "STOREADDRESS";
    store1.setPhone_number = "0101101010";
    await connection.manager.save(store1);
    const store_code = Buffer.from(String(store1.getStore_id),"binary").toString("base64");

    const savedOptiongroup = await saveOptionGroup();

    const updateDto = new OptionGroupUpdateDto();
    updateDto.description = "NEW_DESC";
  

    const response = await optionGroupService.updateOptiongroupInfo(
      savedOptiongroup.getOptionGroupId,
      updateDto,
      store_code
    );
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedOptionGroup = await optionGroupRepository.findOne(savedOptiongroup.getOptionGroupId);
    expect(updatedOptionGroup.getOptionGroupDesc).toBe("NEW_DESC");
  });

  it("Should update optiongroup info(OptionGroupState)", async () => {
    const store1 = new Store();
    store1.setName = "STORENAME";
    store1.setAddress = "STOREADDRESS";
    store1.setPhone_number = "0101101010";
    await connection.manager.save(store1);
    const store_code = Buffer.from(String(store1.getStore_id),"binary").toString("base64");

    const savedOptiongroup = await saveOptionGroup();

    const updateDto = new OptionGroupUpdateDto();
    updateDto.state = "NEW_STATE";
  

    const response = await optionGroupService.updateOptiongroupInfo(
      savedOptiongroup.getOptionGroupId,
      updateDto,
      store_code
    );
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedOptionGroup = await optionGroupRepository.findOne(savedOptiongroup.getOptionGroupId);
    expect(updatedOptionGroup.getOptionGroupState).toBe("NEW_STATE");
  });

  it("Should update optiongroup info(Option)", async () => {
    const option1 = new Option();
    option1.setOptionName = "NAME";
    option1.setOptionPrice = 500;
    option1.setOptionState = "STATE";
    await connection.manager.save(option1);

    const option2 = new Option();
    option2.setOptionName = "NAME2";
    option2.setOptionPrice = 500;
    option2.setOptionState = "STATE2";
    await connection.manager.save(option2);

    const OptionList = [option1, option2];

    const savedOptionGroup = new OptionGroup();
    savedOptionGroup.setOptionGroupName = NAME;
    savedOptionGroup.setOptionGroupDesc = DESC;
    savedOptionGroup.setOptionGroupState = STATE;
    savedOptionGroup.option_id = OptionList;

    await optionGroupRepository.save(savedOptionGroup);

    
    const updateDto = new OptionGroupUpdateDto();
    updateDto.option_id = [7,];

    const response = await optionGroupService.updateOptionInOptionGroup(
      savedOptionGroup.getOptionGroupId,
      updateDto
    );

    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedOptionGroup = await optionGroupService.getOptiongroupInfo(savedOptionGroup.getOptionGroupId);
    expect(updatedOptionGroup.option_id).toStrictEqual(MakeOptionPreview([option1,]));
  });

  it("Should update optiongroup info(Menu)", async () => {
    const menu1 = new Menu();
    menu1.setMenuName = "MENU1NAME";
    menu1.setMenuPrice = 50000;
    await connection.manager.save(menu1);

    const menu2 = new Menu();
    menu2.setMenuName = "MENU2NAME";
    menu2.setMenuPrice = 5000;
    await connection.manager.save(menu2);

    const menuList = [menu1, menu2];

    const savedOptionGroup = new OptionGroup();
    savedOptionGroup.setOptionGroupName = NAME;
    savedOptionGroup.setOptionGroupDesc = DESC;
    savedOptionGroup.setOptionGroupState = STATE;
    savedOptionGroup.menus = menuList;

    await optionGroupRepository.save(savedOptionGroup);

    
    const updateDto = new OptionGroupUpdateDto();
    updateDto.menus = [7,];

    const response = await optionGroupService.updateMenuInOptionGroup(
      savedOptionGroup.getOptionGroupId,
      updateDto
    );

    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedOptionGroup = await optionGroupService.getOptiongroupInfo(savedOptionGroup.getOptionGroupId);
    expect(updatedOptionGroup.menus).toStrictEqual(MakeMenuPreview([menu1,]));
  });

  it("Should remove optiongroup(All)", async () => {
    const savedOptionGroup = await saveOptionGroup();

    const response = await optionGroupService.removeOptiongroup(savedOptionGroup.getOptionGroupId);
    expect(response).toBeInstanceOf(BasicMessageDto);

    const optionGroup = await optionGroupRepository.findOne(savedOptionGroup.getOptionGroupId);
    expect(optionGroup).toBeUndefined();
  });
});
