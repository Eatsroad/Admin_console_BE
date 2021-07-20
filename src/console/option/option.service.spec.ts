import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BasicMessageDto } from '../../../src/common/dtos/basic-massage.dto';
import { Option } from '../../../src/entities/option/option.entity';
import { OptionGroup } from '../../../src/entities/option/optionGroup.entity';
import { createMemoryDB } from '../../../src/utils/connections/create-memory-db';
import { Connection, Repository, UsingJoinColumnOnlyOnOneSideAllowedError } from 'typeorm';
import { OptionGroupPreviewInfo } from '../optiongroup/dtos/optiongroup-info.dto';
import { OptionCreateDto } from './dtos/create-option.dto';
import { OptionUpdateDto } from './dtos/update-option.dto';
import { OptionService } from './option.service';
import { Menu } from '../../../src/entities/menu/menu.entity';
import { Category } from '../../../src/entities/category/category.entity';
import { User } from '../../../src/entities/user/user.entity';
import { EnableTime } from '../../../src/entities/menu/enableTime.entity';
import { Store } from '../../../src/entities/store/store.entity';
import { OptionInfoResponseDto } from './dtos/option-info.dto';

describe('OptionService', () => {
  let optionService: OptionService;
  let connection: Connection;
  let optionRepository: Repository<Option>;

  const NAME = "OPTIONNAME";
  const PRICE = 1000;
  const STATE = "OPTIONSTATETRUE";
  const STOREID = null;

  const saveOption = async () : Promise<Option> => {
    const savedOption = new Option();
    savedOption.setOptionName = NAME;
    savedOption.setOptionPrice = PRICE;
    savedOption.setOptionState = STATE;
    savedOption.store = STOREID;
    return await optionRepository.save(savedOption);
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
    connection = await createMemoryDB([ OptionGroup, Option, Menu, Category, User, EnableTime, Store]);
    optionRepository = await connection.getRepository(Option);
    optionService = new OptionService(optionRepository);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should be defined', () => {
    expect(optionService).toBeDefined();
  });

  it("Should Save Option", async () => {
    const optiongroup1 = new OptionGroup();
    optiongroup1.setOptionGroupName = "NAME";
    optiongroup1.setOptionGroupDesc = "DESC";
    optiongroup1.setOptionGroupState = "STATE";
    await connection.manager.save(optiongroup1);

    const optiongroup2 = new OptionGroup();
    optiongroup2.setOptionGroupName = "NAME2";
    optiongroup2.setOptionGroupState = "STATE2";
    optiongroup2.setOptionGroupDesc = "DESC2";
    await connection.manager.save(optiongroup2);
    
    const optionList = [optiongroup1, optiongroup2];

    const store1 = new Store();
    store1.setName = "STORENAME";
    store1.setAddress = "STOREADDRESS";
    store1.setPhone_number = "0101101010";
    await connection.manager.save(store1);

    const dto = new OptionCreateDto();
    dto.name = NAME;
    dto.price = PRICE;
    dto.state = STATE;
    dto.store_id = 1;

    
    const responseDto = await optionService.saveOption(dto);
    expect(responseDto.name).toBe(NAME);
    expect(responseDto.price).toBe(PRICE);
    expect(responseDto.state).toBe(STATE);

    const savedOption = await optionService.getOptionInfo(responseDto.option_id);
    expect(savedOption.name).toBe(responseDto.name);
    expect(savedOption.price).toBe(responseDto.price);
    expect(savedOption.state).toBe(responseDto.state);
    
  });

  it("Should not save option and throw ConflictException", async () => {
    expect.assertions(1);

    const optiongroup1 = new OptionGroup();
    optiongroup1.setOptionGroupName = "NAME";
    optiongroup1.setOptionGroupDesc = "DESC";
    optiongroup1.setOptionGroupState = "STATE";
    await connection.manager.save(optiongroup1);

    const optiongroup2 = new OptionGroup();
    optiongroup2.setOptionGroupName = "NAME2";
    optiongroup2.setOptionGroupState = "STATE2";
    optiongroup2.setOptionGroupDesc = "DESC2";
    await connection.manager.save(optiongroup2);

    const OPTIONGROUPLIST = [optiongroup1, optiongroup2 ];

    const savedOption = new Option();
    savedOption.setOptionName = NAME;
    savedOption.setOptionPrice = PRICE;
    savedOption.setOptionState = STATE;
    savedOption.option_group_id = OPTIONGROUPLIST;
    await optionRepository.save(savedOption);

    const store1 = new Store();
    store1.setName = "STORENAME";
    store1.setAddress = "STOREADDRESS";
    store1.setPhone_number = "0101101010";
    await connection.manager.save(store1);

    const dto = new OptionCreateDto();
    dto.name = NAME;
    dto.price = PRICE;
    dto.state = STATE;
    dto.store_id = 2;

    try {
      await optionService.saveOption(dto);
    
    } catch (exception) {
      expect(exception).toBeInstanceOf(ConflictException);
    }
  });

  it("Should get option info correctly", async () => {
    const optiongroup1 = new OptionGroup();
    optiongroup1.setOptionGroupName = "NAME";
    optiongroup1.setOptionGroupDesc = "DESC";
    optiongroup1.setOptionGroupState = "STATE";
    await connection.manager.save(optiongroup1);

    const optiongroup2 = new OptionGroup();
    optiongroup2.setOptionGroupName = "NAME2";
    optiongroup2.setOptionGroupState = "STATE2";
    optiongroup2.setOptionGroupDesc = "DESC2";
    await connection.manager.save(optiongroup2);

    const OPTIONGROUPLIST = [optiongroup1, optiongroup2];

    const store1 = new Store();
    store1.setName = "STORENAME";
    store1.setAddress = "STOREADDRESS";
    store1.setPhone_number = "0101101010";
    await connection.manager.save(store1);

    let savedOption = new Option();
    savedOption.setOptionName = NAME;
    savedOption.setOptionPrice = PRICE;
    savedOption.setOptionState = STATE;
    savedOption.store = store1;
    savedOption.option_group_id = OPTIONGROUPLIST;
    await optionRepository.save(savedOption);
  
    const response = await optionService.getOptionInfo(savedOption.getOptionId);
    expect(response.name).toBe(savedOption.getOptionName);
    expect(response.price).toBe(savedOption.getOptionPrice);
    expect(response.option_group_id).toStrictEqual(savedOption.getOptionGroupsPreviewInfo);
    expect(response.state).toBe(savedOption.getOptionState);
  
  });

  it("Should get option List correctly", async () => {
    const store1 = new Store();
    store1.setName = "STORE1NAME";
    store1.setAddress = "STORE1ADDRESS";
    store1.setPhone_number = "1111";
    store1.setDeletedAt = null;
    store1.setUpdatedAt = null;
    await connection.manager.save(store1);

    const optiongroup1 = new OptionGroup();
    optiongroup1.setOptionGroupName = "NAME";
    optiongroup1.setOptionGroupDesc = "DESC";
    optiongroup1.setOptionGroupState = "STATE";
    await connection.manager.save(optiongroup1);

    const optiongroup2 = new OptionGroup();
    optiongroup2.setOptionGroupName = "NAME2";
    optiongroup2.setOptionGroupState = "STATE2";
    optiongroup2.setOptionGroupDesc = "DESC2";
    await connection.manager.save(optiongroup2);

    const OPTIONGROUPLIST = [optiongroup1, optiongroup2];

    let savedOption = new Option();
    savedOption.setOptionName = NAME;
    savedOption.setOptionPrice = PRICE;
    savedOption.setOptionState = STATE;
    savedOption.option_group_id = OPTIONGROUPLIST;
    savedOption.store = store1;
    await optionRepository.save(savedOption);
  
    let savedOptionPreview = new OptionInfoResponseDto(savedOption);
    savedOptionPreview.name = NAME;
    savedOptionPreview.price = PRICE;
    savedOptionPreview.state = STATE;
    savedOptionPreview.option_group_id = MakeOptionGroupPreview(OPTIONGROUPLIST);

    const response = await optionService.getAllOptionList(savedOption.store.getStore_id);
    expect(response[0].name).toBe(savedOptionPreview.name);
    expect(response[0].price).toBe(savedOptionPreview.price);
    expect(response[0].option_group_id).toStrictEqual(savedOptionPreview.option_group_id);
    expect(response[0].state).toBe(savedOptionPreview.state);
  });


  it("Should throw NotFoundException if option_id is invalid", async () => {
    expect.assertions(1);
    try {
      await optionService.getOptionInfo(-1);
    } catch (exception) {
      expect(exception).toBeInstanceOf(NotFoundException);
    }
  });

  it("Should update option info(All)", async () => {
    const optiongroup1 = new OptionGroup();
    optiongroup1.setOptionGroupName = "NAME";
    optiongroup1.setOptionGroupDesc = "DESC";
    await connection.manager.save(optiongroup1);

    const optiongroup2 = new OptionGroup();
    optiongroup2.setOptionGroupName = "NAME2";
    optiongroup2.setOptionGroupDesc = "DESC2";
    await connection.manager.save(optiongroup2);

    const OptiongroupList = [optiongroup1, optiongroup2];

    const savedOption = new Option();
    savedOption.setOptionName = NAME;
    savedOption.setOptionPrice = PRICE;
    savedOption.setOptionState = STATE;
    savedOption.option_group_id = OptiongroupList;

    await optionRepository.save(savedOption);

    const updateDtoInfo = new OptionUpdateDto();
    updateDtoInfo.name = "UPDATED NAME";
    updateDtoInfo.state = "UPDATED STATE";
    updateDtoInfo.price = 500;

    const responseInfo = await optionService.updateOptionInfo(
      savedOption.getOptionId,
      updateDtoInfo
    );

    const updateDto = new OptionUpdateDto();
    updateDto.option_group_id = [9,];

    const response = await optionService.updateOptionGroupInOption(
      savedOption.getOptionId,
      updateDto
    )

    expect(responseInfo).toBeInstanceOf(BasicMessageDto);
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedOption = await optionService.getOptionInfo(savedOption.getOptionId);
    expect(updatedOption.name).toBe("UPDATED NAME");
    expect(updatedOption.price).toBe(500);
    expect(updatedOption.state).toBe("UPDATED STATE");
    expect(updatedOption.option_group_id).toStrictEqual(MakeOptionGroupPreview([optiongroup1,]));
  });

  it("Should update option info(OptionName)", async () => {
    const savedMenu = await saveOption();

    const updateDto = new OptionUpdateDto();
    updateDto.name = "NEW_NAME";
  

    const response = await optionService.updateOptionInfo(
      savedMenu.getOptionId,
      updateDto
    );
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedOption = await optionRepository.findOne(savedMenu.getOptionId);
    expect(updatedOption.getOptionName).toBe("NEW_NAME");
  });

  it("Should update option info(OptionPrice)", async () => {
    const savedMenu = await saveOption();

    const updateDto = new OptionUpdateDto();
    updateDto.price = 500;
  

    const response = await optionService.updateOptionInfo(
      savedMenu.getOptionId,
      updateDto
    );
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedOption = await optionRepository.findOne(savedMenu.getOptionId);
    expect(updatedOption.getOptionPrice).toBe(500);
  });

  it("Should update option info(OptionState)", async () => {
    const savedMenu = await saveOption();

    const updateDto = new OptionUpdateDto();
    updateDto.state = "NEW_STATE";
  

    const response = await optionService.updateOptionInfo(
      savedMenu.getOptionId,
      updateDto
    );
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedOption = await optionRepository.findOne(savedMenu.getOptionId);
    expect(updatedOption.getOptionState).toBe("NEW_STATE");
  });

  it("Should update option info(OptionGroup)", async () => {
    const optiongroup1 = new OptionGroup();
    optiongroup1.setOptionGroupName = "NAME";
    optiongroup1.setOptionGroupDesc = "DESC";
    optiongroup1.setOptionGroupState = "STATE";
    await connection.manager.save(optiongroup1);

    const optiongroup2 = new OptionGroup();
    optiongroup2.setOptionGroupName = "NAME2";
    optiongroup2.setOptionGroupState = "STATE2";
    optiongroup2.setOptionGroupDesc = "DESC2";
    await connection.manager.save(optiongroup2);

    const OPTIONGROUPLIST = [optiongroup1, optiongroup2];

    const savedOption = new Option();
    savedOption.setOptionName= NAME;
    savedOption.setOptionPrice= PRICE;
    savedOption.setOptionState = STATE;
    savedOption.option_group_id = OPTIONGROUPLIST;

    await optionRepository.save(savedOption);

    const updateDtoInfo = new OptionUpdateDto();
    updateDtoInfo.option_group_id = [11,];

    const responseInfo = await optionService.updateOptionGroupInOption(
    savedOption.getOptionId,
      updateDtoInfo
    );

    expect(responseInfo).toBeInstanceOf(BasicMessageDto);

    const updatedOption = await optionService.getOptionInfo(savedOption.getOptionId);
    expect(updatedOption.option_group_id).toStrictEqual(MakeOptionGroupPreview([optiongroup1,]));
  });

  it("Should remove option(All)", async () => {
    const savedOption = await saveOption();

    const response = await optionService.removeOption(savedOption.getOptionId);
    expect(response).toBeInstanceOf(BasicMessageDto);

    const option = await optionRepository.findOne(savedOption.getOptionId);
    expect(option).toBeUndefined();
  });
});
