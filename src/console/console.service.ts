import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { Store } from 'src/entities/store/store.entity';
import { Repository } from 'typeorm';
import { StoreCreateDto } from './dtos/create-store.dto';
import { StoreInfoResponseDto } from './dtos/store-info.dto';

@Injectable()
export class ConsoleService {
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
private isPhoneNumberUsed = async(phoneNumber : string): Promise<boolean>=>{
    return(
        (await this.storeRepository
            .createQueryBuilder()
            .select("s.store_id")
            .from(Store, "s")
            .where("s.phone_number = :phone_number", {phoneNumber})
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
//이부분모르겠다아 -> 알게된듯
private storeCreateDtoToEntity = (dto:StoreCreateDto): Store=>{
    const store = new Store();
    store.setName = dto.name;
    store.setAddress = dto.address;
    store.setPhone_number = dto.phone_number
    return store;
}


async saveStore(dto: StoreCreateDto): Promise<StoreInfoResponseDto>{
    if(await this.isStoreNameUsed(dto.name)){
            throw new ConflictException("Store name is already in use!");        
    }   else if(await this.isAddressUsed(dto.address)){ 
            throw new ConflictException("Store address is already in use!"); 
    }   else if(await this.isPhoneNumberUsed(dto.phone_number)){
            throw new ConflictException("Store phone_number is already in use!"); 
    }else{
        const store = await this.storeRepository.save(
            this.storeCreateDtoToEntity(dto)
        );
        return new StoreInfoResponseDto(store);
    }
}
}

/*
async saveUser(dto: UserCreateDto): Promise<UserInfoResponseDto> {
    if (await this.isEmailUsed(dto.email)) {
      throw new ConflictException("Email is already in use!");
    } else {
      const user = await this.userRepository.save(
        this.userCreateDtoToEntity(dto)
      );
      return new UserInfoResponseDto(user);
    }
  }
*/