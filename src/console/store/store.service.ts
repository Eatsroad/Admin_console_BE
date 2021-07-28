import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BasicMessageDto } from "../../../src/common/dtos/basic-massage.dto";
import { Store } from "../../../src/entities/store/store.entity";
import { getRepository, Repository, Transaction } from "typeorm";
import { StoreCreateDto } from "./dtos/create-store.dto";
import { StoreInfoResponseDto } from "./dtos/store-info-dto";
import { StoreUpdateDto } from "./dtos/update-store.dto";
import { User } from "../../../src/entities/user/user.entity";
import IStoreRequest from "src/interfaces/store-request";

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store) private readonly storeRepository: Repository<Store>
  ) {}

  private isStoreNameUsed = async (name: string): Promise<boolean> => {
    return (
      (await this.storeRepository
        .createQueryBuilder()
        .select("s.store_id")
        .from(Store, "s")
        .where("s.name = :name", { name })
        .getOne()) !== undefined
    );
  };
  private isPhoneNumberUsed = async (
    phone_number: string
  ): Promise<boolean> => {
    return (
      (await this.storeRepository
        .createQueryBuilder()
        .select("s.store_id")
        .from(Store, "s")
        .where("s.phone_number = :phone_number", { phone_number })
        .getOne()) !== undefined
    );
  };

  private isAddressUsed = async (address: string): Promise<boolean> => {
    return (
      (await this.storeRepository
        .createQueryBuilder()
        .select("s.store_id")
        .from(Store, "s")
        .where("s.address = :address", { address })
        .getOne()) !== undefined
    );
  };

  private storeCreateDtoToEntity = async (
    dto: StoreCreateDto,
    userId: number
  ): Promise<Store> => {
    const store = new Store();
    store.setName = dto.name;
    store.setAddress = dto.address;
    store.setPhone_number = dto.phone_number;
    store.setTables = dto.tables;

    const someuser = getRepository(User);
    const someuser_id = await someuser.findOne(userId);
    store.user = someuser_id;

    return store;
  };

  async saveStore(
    dto: StoreCreateDto,
    userId: number
  ): Promise<StoreInfoResponseDto> {
    try{
      if (await this.isStoreNameUsed(dto.name)) {
        throw new ConflictException("Store name is already in use!");
      } else if (await this.isAddressUsed(dto.address)) {
        throw new ConflictException("Store address is already in use!");
      } else if (await this.isPhoneNumberUsed(dto.phone_number)) {
        throw new ConflictException("Store phone_number is already in use!");
      } else {
        const store = await this.storeRepository.save(
          await this.storeCreateDtoToEntity(dto, userId)
        );
        return new StoreInfoResponseDto(store);
      }
    } catch(e){
      console.log(e);
    }
    
  }

  async getStoreInfo(storeId: string): Promise<StoreInfoResponseDto> {
    const storeRealId = Buffer.from(storeId, "base64").toString("binary");
    const store = await this.storeRepository.findOne(storeRealId, {
      relations: ["menus", "user"],
    });
    if (!!store) {
      return new StoreInfoResponseDto(store);
    } else {
      throw new NotFoundException();
    }
  }

  async updateStoreInfo(
    storeId: string,
    dto: StoreUpdateDto
  ): Promise<BasicMessageDto> {
    const storeRealId = Number(
      Buffer.from(storeId, "base64").toString("binary")
    );
    const result = await this.storeRepository
      .createQueryBuilder()
      .update("stores", { ...dto })
      .where("store_id = :storeRealId", { storeRealId })
      .execute();

    if (result.affected !== 0) {
      return new BasicMessageDto("Updated Successfully.");
    } else try{
      throw new NotFoundException();
    } catch(e){
      console.log(e);
    }
  }

  async removeStore(storeId: string): Promise<BasicMessageDto> {
    const storeRealId = Buffer.from(storeId, "base64").toString("binary");
    const result = await this.storeRepository.softDelete(storeRealId);
    if (result.affected !== 0) {
      return new BasicMessageDto("Deleted Successfully.");
    } else throw new NotFoundException();
  }
}
