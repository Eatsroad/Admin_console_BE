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
  
  beforeAll(async () => {
    connection = await createMemoryDB([OptionGroup, Option]);
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

    const dto = new OptionGroupCreateDto();
    dto.name = NAME;
    dto.description = DESC;
    dto.state = STATE;
    dto.option_id = [1,2];
    
    const responseDto = await optionGroupService.saveOptionGroup(dto);
    expect(responseDto.name).toBe(NAME);
    expect(responseDto.description).toBe(DESC);
    expect(responseDto.state).toBe(STATE);

    const savedOptionGroup = await optionGroupService.getOptiongroupInfo(responseDto.option_group_id);
    expect(savedOptionGroup.name).toBe(responseDto.name);
    expect(savedOptionGroup.description).toBe(responseDto.description);
    expect(savedOptionGroup.state).toBe(responseDto.state);
  });

  it("Should not save optionGroup and throw ConflictException", async () => {
    expect.assertions(1);

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

    const dto = new OptionGroupCreateDto();
    dto.name = NAME;
    dto.description = DESC;
    dto.state = STATE;
    dto.option_id = [3,4];

    try {
      await optionGroupService.saveOptionGroup(dto);
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

    let savedOptionGroup = new OptionGroup();
    savedOptionGroup.setOptionGroupName = NAME;
    savedOptionGroup.setOptionGroupDesc = DESC;
    savedOptionGroup.setOptionGroupState = STATE;
    savedOptionGroup.option_id = OptionList;
    await optionGroupRepository.save(savedOptionGroup);
    
    const response = await optionGroupService.getOptiongroupInfo(savedOptionGroup.getOptionGroupId);
 
    expect(response.name).toBe(savedOptionGroup.getOptionGroupName);
    expect(response.description).toBe(savedOptionGroup.getOptionGroupDesc);
    expect(response.state).toBe(savedOptionGroup.getOptionGroupState);
    expect(response.option_id).toStrictEqual(savedOptionGroup.getOptionsPreviewInfo);
  });

  it("Should throw NotFoundException if option_id is invalid", async () => {
    expect.assertions(1);
    try {
      await optionGroupService.getOptiongroupInfo(-1);
    } catch (exception) {
      expect(exception).toBeInstanceOf(NotFoundException);
    }
  });

  it("Should update option info(All)", async () => {
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

    const updateDtoInfo = new OptionGroupUpdateDto();
    updateDtoInfo.name = "UPDATED NAME";
    updateDtoInfo.state = "UPDATED STATE";
    updateDtoInfo.description = "UPDATED DESC";

    const responseInfo = await optionGroupService.updateOptiongroupInfo(
      savedOptionGroup.getOptionGroupId,
      updateDtoInfo
    );

    const updateDto = new OptionGroupUpdateDto();
    updateDto.option_id = [7,];

    const response = await optionGroupService.updateOptionInOptionGroup(
      savedOptionGroup.getOptionGroupId,
      updateDto
    )

    expect(responseInfo).toBeInstanceOf(BasicMessageDto);
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedOptionGroup = await optionGroupService.getOptiongroupInfo(savedOptionGroup.getOptionGroupId);
    expect(updatedOptionGroup.name).toBe("UPDATED NAME");
    expect(updatedOptionGroup.description).toBe("UPDATED DESC");
    expect(updatedOptionGroup.state).toBe("UPDATED STATE");
    expect(updatedOptionGroup.option_id).toStrictEqual(MakeOptionPreview([option1,]))
  });

  it("Should update optiongroup info(OptionGroupName)", async () => {
    const savedOptiongroup = await saveOptionGroup();

    const updateDto = new OptionGroupUpdateDto();
    updateDto.name = "NEW_NAME";
  

    const response = await optionGroupService.updateOptiongroupInfo(
      savedOptiongroup.getOptionGroupId,
      updateDto
    );
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedOptionGroup = await optionGroupRepository.findOne(savedOptiongroup.getOptionGroupId);
    expect(updatedOptionGroup.getOptionGroupName).toBe("NEW_NAME");
  });

  it("Should update optiongroup info(OptionGroupDesc)", async () => {
    const savedOptiongroup = await saveOptionGroup();

    const updateDto = new OptionGroupUpdateDto();
    updateDto.description = "NEW_DESC";
  

    const response = await optionGroupService.updateOptiongroupInfo(
      savedOptiongroup.getOptionGroupId,
      updateDto
    );
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedOptionGroup = await optionGroupRepository.findOne(savedOptiongroup.getOptionGroupId);
    expect(updatedOptionGroup.getOptionGroupDesc).toBe("NEW_DESC");
  });

  it("Should update optiongroup info(OptionGroupState)", async () => {
    const savedOptiongroup = await saveOptionGroup();

    const updateDto = new OptionGroupUpdateDto();
    updateDto.state = "NEW_STATE";
  

    const response = await optionGroupService.updateOptiongroupInfo(
      savedOptiongroup.getOptionGroupId,
      updateDto
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
    updateDto.option_id = [9,];

    const response = await optionGroupService.updateOptionInOptionGroup(
      savedOptionGroup.getOptionGroupId,
      updateDto
    );

    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedOptionGroup = await optionGroupService.getOptiongroupInfo(savedOptionGroup.getOptionGroupId);
    expect(updatedOptionGroup.option_id).toStrictEqual(MakeOptionPreview([option1,]));
  });

  it("Should remove menu(All)", async () => {
    const savedOptionGroup = await saveOptionGroup();

    const response = await optionGroupService.removeOptiongroup(savedOptionGroup.getOptionGroupId);
    expect(response).toBeInstanceOf(BasicMessageDto);

    const optionGroup = await optionGroupRepository.findOne(savedOptionGroup.getOptionGroupId);
    expect(optionGroup).toBeUndefined();
  });
});