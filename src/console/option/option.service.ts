import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { async, VirtualTimeScheduler } from "rxjs";
import { BasicMessageDto } from "../../../src/common/dtos/basic-massage.dto";
import { Option } from "../../../src/entities/option/option.entity";
import { OptionGroup } from "../../../src/entities/option/optionGroup.entity";
import { getRepository, Repository } from "typeorm";
import { resourceLimits } from "worker_threads";
import { MenuInfoResponseDto } from "../menu/dtos/menu-info.dto";
import { OptionCreateDto } from "./dtos/create-option.dto";
import { OptionInfoResponseDto } from "./dtos/option-info.dto";
import { OptionUpdateDto } from "./dtos/update-option.dto";
import { Store } from "../../../src/entities/store/store.entity";

@Injectable()
export class OptionService{
    constructor(
        @InjectRepository(Option) private readonly optionRepository : Repository<Option>,
    ) {}

    private OptionExist = async (name: string, price:number) : Promise<boolean> => {
        return (
            (await this.optionRepository
                .createQueryBuilder()
                .select("o.state")
                .from(Option, "o")
                .where("o.name =:name",{ name })
                .andWhere("o.price =:price",{ price })
                .getOne()) !== undefined
        );
    };

    private convert2OptionGroupObj = async (optionGroup:number[]) : Promise<OptionGroup[]> => {
        const optiongroups = getRepository(OptionGroup);
        return await optiongroups.findByIds(optionGroup);
    }

    private convert2StoreObj = async (store_id: number): Promise<Store> => {
        const store = getRepository(Store);
        return await store.findOne(store_id);
    }

    private optionCreateDtoToEntity = async(dto:OptionCreateDto): Promise<Option> => {
        const option = new Option();
        option.setOptionName = dto.name;
        option.setOptionPrice = dto.price;
        option.setOptionState = dto.state;
        option.store = await this.convert2StoreObj(dto.store_id);
        return option;
    }

    async saveOption(dto: OptionCreateDto): Promise<OptionInfoResponseDto>{
        if ( await this.OptionExist(dto.name, dto.price)){
            throw new ConflictException("Option Name is already in use!");
        } else {
            const option = await this.optionRepository.save(
                await this.optionCreateDtoToEntity(dto)
            );
            return new OptionInfoResponseDto(option);
        }
    }

    async getOptionInfo(option_id: number): Promise<OptionInfoResponseDto> {
        const option = await this.optionRepository.findOne(option_id,{relations:['option_group_id','store']});
        if(!!option){
            return new OptionInfoResponseDto(option);
        } else {
            throw new NotFoundException();
        }
    }

    async getAllOptionList(store_id: number) : Promise<OptionInfoResponseDto[]>{
        const options = await this.optionRepository.find({
            where:{
                store: store_id
            },
            relations:['store','option_group_id']
        });
        return options.map((option)=> new OptionInfoResponseDto(option));
    }

    async updateOptionInfo(
        option_id:number,
        dto: OptionUpdateDto,
    ): Promise<BasicMessageDto> {
        if(await this.OptionExist(dto.name, dto.price)){
            throw new ConflictException("Option is already in use!");
        } else {
            const option = await this.optionRepository
            .createQueryBuilder()
            .update("options",{...dto})
            .where("option_id =:option_id", { option_id })
            .execute();
            if(option.affected !== 0){
                return new BasicMessageDto("Updated Successfully");
            } else throw new NotFoundException();
        }
    }

    async updateOptionGroupInOption(
        option_id:number,
        dto:OptionUpdateDto
    ): Promise<BasicMessageDto>{
        const option = await this.optionRepository.findOne(option_id);
        option.option_group_id = await this.convert2OptionGroupObj(dto.option_group_id);

        const result = await this.optionRepository.save(option);
        if(!!result){
            return new BasicMessageDto("OptionGroups are Updated Successfully in Option.");
        } else throw new NotFoundException();
    }

    async removeOption(option_id: number) {
        const result = await this.optionRepository.delete(option_id);
        if(result.affected !== 0){
            return new BasicMessageDto("Deleted Successfully.");
        } else throw new NotFoundException();
    }


}