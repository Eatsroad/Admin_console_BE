import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { BasicMessageDto } from '../../../src/common/dtos/basic-massage.dto';
import { Store } from '../../../src/entities/store/store.entity';
import { getRepository, Repository } from 'typeorm';
import { StoreCreateDto } from './dtos/create-store.dto';
import { StoreInfoResponseDto } from './dtos/store-info-dto';
import { StoreUpdateDto } from './dtos/update-store.dto';
import { User } from '../../entities/user/user.entity';



@Injectable()
export class StoreService {
    constructor(
        @InjectRepository(Store) private readonly storeRepository: Repository<Store>) {}

    private isStoreNameUsed = async(name : string): Promise<boolean>=>{
        return(
            (await this.storeRepository
                .createQueryBuilder()
                .select("s.store_id")
                .from(Store, "s")
                .where("s.name = :name", {name})
                .getOne()) !==undefined

            )
    }
    private isPhoneNumberUsed = async(phone_number : string): Promise<boolean>=>{
        return(
            (await this.storeRepository
                .createQueryBuilder()
                .select("s.store_id")
                .from(Store, "s")
                .where("s.phone_number = :phone_number", {phone_number})
                .getOne()) !==undefined

            )
    }
    private isAddressUsed = async(address : string): Promise<boolean>=>{
        return(
            (await this.storeRepository
                .createQueryBuilder()
                .select("s.store_id")
                .from(Store, "s")
                .where("s.address = :address", {address})
                .getOne()) !==undefined

            )
    }

    private storeCreateDtoToEntity = async (dto:StoreCreateDto, userid:string): Promise<Store> => {
        const store = new Store();
        store.setName = dto.name;
        store.setAddress = dto.address;
        store.setPhone_number = dto.phone_number;
        store.setTables = dto.tables;

        const someuser = getRepository(User);
        const someuser_id = await someuser.findOne(userid)
        store.user_id = someuser_id;

        return store;
    }


    async saveStore(dto: StoreCreateDto, req): Promise<StoreInfoResponseDto>{
        if(await this.isStoreNameUsed(dto.name)){
                throw new ConflictException("Store name is already in use!");        
        }   else if(await this.isAddressUsed(dto.address)){ 
                throw new ConflictException("Store address is already in use!"); 
        }   else if(await this.isPhoneNumberUsed(dto.phone_number)){
                throw new ConflictException("Store phone_number is already in use!"); 
        }else{
            const store = await this.storeRepository.save(
                await this.storeCreateDtoToEntity(dto, req.user_id)
            );
            return new StoreInfoResponseDto(store);
        }
    }

    async getStoreInfo(storeId: number): Promise<StoreInfoResponseDto> {
        const store = await this.storeRepository.findOne(storeId);
        if (!!store) {
        return new StoreInfoResponseDto(store);
        } else {
        throw new NotFoundException();
        }
    }

    async updateStoreInfo(
    storeId: number,
    dto: StoreUpdateDto
    ): Promise<BasicMessageDto> {
    const result = await this.storeRepository
        .createQueryBuilder()
        .update("stores", { ...dto })
        .where("store_id = :storeId", { storeId })
        .execute();
    if (result.affected !== 0) {
        return new BasicMessageDto("Updated Successfully.");
    } else throw new NotFoundException();

    }

    async removeStore(storeId: number): Promise<BasicMessageDto> {
        const result = await this.storeRepository.softDelete(storeId);
        if (result.affected !== 0) {
          return new BasicMessageDto("Deleted Successfully.");
        } else throw new NotFoundException();
      }
}