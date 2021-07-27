import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicMessageDto } from '../../../src/common/dtos/basic-massage.dto';
import { OptionGroup } from '../../../src/entities/option/optionGroup.entity';
import { getRepository, Repository } from 'typeorm';
import { OptionGroupCreateDto } from './dtos/create-optiongroup.dto';
import { OptionGroupInfoResponseDto } from './dtos/optiongroup-info.dto';
import { OptionGroupUpdateDto } from './dtos/update-optiongroup.dto';
import { Option } from '../../../src/entities/option/option.entity';
import { Store } from '../../../src/entities/store/store.entity';
import { Menu } from '../../../src/entities/menu/menu.entity';

@Injectable()
export class OptiongroupService {
    constructor(
        @InjectRepository(OptionGroup) private readonly optiongroupRepository: Repository<OptionGroup>,
    ) {}

    private OptionGroupExist = async (name: string, storeId: string): Promise<boolean> => {
        const RealStoreId = Number(Buffer.from(storeId, "base64").toString("binary"));
        return (
            (await this.optiongroupRepository
            .createQueryBuilder()
            .select("og.description")
            .from(OptionGroup,"og")
            .where("og.name = :name",{ name })
            .andWhere("og.store_id = :RealStoreId", { RealStoreId })
            .getOne()) !== undefined
        );
    };

    private convert2OptionObj = async (option:number[]) : Promise<Option[]> => {
        const optiongroups = getRepository(Option);
        return await optiongroups.findByIds(option);
    }

    private convert2storeObj = async (storeId: number) : Promise<Store> => {
        const stores = getRepository(Store);
        return await stores.findOne(storeId);
    }
     
    private convert2MenuObj = async (menu: number[]) : Promise<Menu[]> => {
        const menus = getRepository(Menu);
        return await menus.findByIds(menu);
    }

    private optiongroupCreateDtoToEntity = async (dto: OptionGroupCreateDto , storeId: string): Promise<OptionGroup>=>{
        const RealStoreId = Number(Buffer.from(storeId, "base64").toString("binary"));
        const optiongroup = new OptionGroup();
        optiongroup.setOptionGroupName = dto.name;
        optiongroup.setOptionGroupDesc = dto.description;
        optiongroup.setOptionGroupState = dto.state;
        optiongroup.store = await this.convert2storeObj(RealStoreId);
        return optiongroup;
    }

    async saveOptionGroup(dto: OptionGroupCreateDto, storeId: string): Promise<OptionGroupInfoResponseDto>{
        if( await this.OptionGroupExist(dto.name,storeId)){
            throw new ConflictException("Option Group Name is already in use!");
        } else {
            const optiongroup = await this.optiongroupRepository.save(
                await this.optiongroupCreateDtoToEntity(dto, storeId)
            );
            return new OptionGroupInfoResponseDto(optiongroup);
        }
    }

    async getOptiongroupInfo(option_group_id: number): Promise<OptionGroupInfoResponseDto>{
        const optiongroup = await this.optiongroupRepository.findOne(option_group_id, {relations:['option_id','menus','store']});
        if(!!optiongroup){
            return new OptionGroupInfoResponseDto(optiongroup);
        } else {
            throw new NotFoundException();
        }
    }

    async getAllOptionGroupList (storeId : string) : Promise<OptionGroupInfoResponseDto[]>{
        const RealStoreId = Number(Buffer.from(storeId, "base64").toString("binary"));
        const optionGroups = await this.optiongroupRepository.find({
            where: {
                store: RealStoreId
            },
            relations: ['store','menus','option_id']
        });
        return optionGroups.map((optiongroup) => new OptionGroupInfoResponseDto(optiongroup));
    }

    async updateOptiongroupInfo(
        option_group_id: number,
        dto: OptionGroupUpdateDto,
        storeId: string
    ): Promise<BasicMessageDto>{
        if(await this.OptionGroupExist(dto.name, storeId)){
            throw new ConflictException("Option Group Name is already in use!");
        } else {
            const result = await this.optiongroupRepository
            .createQueryBuilder()
            .update("option_groups", {...dto})
            .where("option_group_id =:option_group_id", { option_group_id })
            .execute();
            if(result.affected !==0){
                return new BasicMessageDto("Updated Successfully.");
            } else throw new NotFoundException();

        }
    }

    async updateOptionInOptionGroup(
        option_group_id:number,
        dto:OptionGroupUpdateDto
    ): Promise<BasicMessageDto>{
        const optiongroup = await this.optiongroupRepository.findOne(option_group_id);
        optiongroup.option_id = await this.convert2OptionObj(dto.option_id);

        const result = await this.optiongroupRepository.save(optiongroup);
        if(!!result){
            return new BasicMessageDto("Options are Updated Successfully in OptionGroup.");
        } else throw new NotFoundException();
    }

    async updateMenuInOptionGroup(
        option_group_id: number,
        dto:OptionGroupUpdateDto
    ): Promise<BasicMessageDto> {
        const optiongroup = await this.optiongroupRepository.findOne(option_group_id);
        optiongroup.menus = await this.convert2MenuObj(dto.menus);
        const result = await this.optiongroupRepository.save(optiongroup);
        if(!!result){
            return new BasicMessageDto("Menus are Updated Successfully in OptionGroup.");
        } else throw new NotFoundException();
    }

    async removeOptiongroup(option_group_id: number): Promise<BasicMessageDto>{
        const result = await this.optiongroupRepository.delete(option_group_id);
        if (result.affected !== 0){
            return new BasicMessageDto("Deleted Successfully");
        } else throw new NotFoundException();
    }

}
