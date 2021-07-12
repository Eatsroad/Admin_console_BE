import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicMessageDto } from '../../../src/common/dtos/basic-massage.dto';
import { OptionGroup } from '../../../src/entities/option/optionGroup.entity';
import { getRepository, Repository } from 'typeorm';
import { OptionGroupCreateDto } from './dtos/create-optiongroup.dto';
import { OptionGroupInfoResponseDto } from './dtos/optiongroup-info.dto';
import { OptionGroupUpdateDto } from './dtos/update-optiongroup.dto';
import { Option } from '../../../src/entities/option/option.entity';

@Injectable()
export class OptiongroupService {
    constructor(
        @InjectRepository(OptionGroup) private readonly optiongroupRepository: Repository<OptionGroup>,
    ) {}

    private OptionGroupExist = async (name: string): Promise<boolean> => {
        return (
            (await this.optiongroupRepository
            .createQueryBuilder()
            .select("og.description")
            .from(OptionGroup,"og")
            .where("og.name = :name",{ name })
            .getOne()) !== undefined
        );
    };

    private convert2OptionObj = async (option:number[]) : Promise<Option[]> => {
        const optiongroups = getRepository(Option);
        return await optiongroups.findByIds(option);
    }

    private optiongroupCreateDtoToEntity = async (dto: OptionGroupCreateDto): Promise<OptionGroup>=>{
        const optiongroup = new OptionGroup();
        optiongroup.setOptionGroupName = dto.name;
        optiongroup.setOptionGroupDesc = dto.description;
        optiongroup.setOptionGroupState = dto.state;
        optiongroup.option_id = await this.convert2OptionObj(dto.option_id);
        return optiongroup;
    }

    async saveOptionGroup(dto: OptionGroupCreateDto): Promise<OptionGroupInfoResponseDto>{
        if( await this.OptionGroupExist(dto.name)){
            throw new ConflictException("Option Group Name is already in use!");
        } else {
            const optiongroup = await this.optiongroupRepository.save(
                await this.optiongroupCreateDtoToEntity(dto)
            );
            return new OptionGroupInfoResponseDto(optiongroup);
        }
    }

    async getOptiongroupInfo(option_group_id: number): Promise<OptionGroupInfoResponseDto>{
        const optiongroup = await this.optiongroupRepository.findOne(option_group_id, {relations:['option_id']});
        if(!!optiongroup){
            return new OptionGroupInfoResponseDto(optiongroup);
        } else {
            throw new NotFoundException();
        }
    }

    // async getAllOptiongroupList (menuId : number) : Promise<OptionGroupInfoResponseDto[]>{
    //     const Optiongroups = await this.optiongroupRepository.find({
    //         where: {
    //             menu_id : menuId
    //         },
    //         relations: ['menu_id']
    //     });
    //     return Optiongroups.map((optiongroup) => new OptionGroupInfoResponseDto(optiongroup));
    // }

    // async getAllOptionGroupList ( storeId : number) : Promise<OptionGroupInfoResponseDto[]>{
    //     const Optiongroup = await this.optiongroupRepository
    //     .createQueryBuilder("menus_and_option_groups")
    //     .leftJoinAndSelect("menus_and_option_groups.menu_id","menus")
    //     .select(["menus_and_option_groups.option_group_id"])
    //     .andWhere("menus_and_option_groups.store_id =:storeId",{ storeId })
    //     .getRawMany();

    //     console.log(Optiongroup);
    //    return await Optiongroup.map((result) => new OptionGroupInfoResponseDto(result));
    // }

    async updateOptiongroupInfo(
        option_group_id: number,
        dto: OptionGroupUpdateDto
    ): Promise<BasicMessageDto>{
        if(await this.OptionGroupExist(dto.name)){
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

    async removeOptiongroup(option_group_id: number): Promise<BasicMessageDto>{
        const result = await this.optiongroupRepository.delete(option_group_id);
        if (result.affected !== 0){
            return new BasicMessageDto("Deleted Successfully");
        } else throw new NotFoundException();
    }

    
}
