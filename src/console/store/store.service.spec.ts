import { Test, TestingModule } from '@nestjs/testing';
import { Store } from '../../../src/entities/store/store.entity';
import { User } from '../../../src/entities/user/user.entity';
import { createMemoryDB } from '../../../src/utils/connections/create-memory-db';
import { Connection, Repository } from 'typeorm';
import { StoreService } from './store.service';
import { StoreCreateDto } from './dtos/create-store.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { BasicMessageDto } from '../../../src/common/dtos/basic-massage.dto';
import { StoreUpdateDto } from './dtos/update-store.dto';
import { stringify } from 'querystring';

describe('StoreService', () => {
  let storeService: StoreService;
  let connection: Connection;
  let storeRepository : Repository<Store>;

  const NAME = 'NAME';
  const ADDRESS = 'ADDRESS';
  const PHONE_NUMBER = '01012345667';
  const TABLES = 45;
  const USERID = "1234";

  const saveStore = async () : Promise<Store>=>{
    const savedStore = new Store();
    savedStore.setName = NAME;
    savedStore.setAddress = ADDRESS;
    savedStore.setPhone_number = PHONE_NUMBER;
    savedStore.setTables = TABLES;
    savedStore.setUserId = USERID;
    return await storeRepository.save(savedStore)
  };

  beforeAll(async () => {
    connection = await createMemoryDB([User,Store]);
    storeRepository = await connection.getRepository(Store);
    storeService = new StoreService(storeRepository)
  });

  afterAll(async() =>{
    await connection.close();
  });

  afterEach(async () => {
    await storeRepository.query("DELETE FROM stores");
  });
  
  it('should be defined', () => {
    expect(storeService).toBeDefined();
  });

  it("Should Save Store", async () => {
    const dto = new StoreCreateDto();
    dto.name = NAME;
    dto.address = ADDRESS;
    dto.phone_number = PHONE_NUMBER;
    dto.tables = TABLES;
    const userid = USERID;

    const responseDto = await storeService.saveStore(dto, userid);

    expect(responseDto.name).toBe(NAME);
    expect(responseDto.address).toBe(ADDRESS);
    expect(typeof responseDto.store_id).toBe("number");
    expect(responseDto.phone_number).toBe(PHONE_NUMBER);

    const savedStore = await storeRepository.findOne(responseDto.store_id);

    expect(savedStore.getStore_id).toBe(responseDto.store_id);
    expect(savedStore.getAddress).toBe(responseDto.address);
    expect(savedStore.getPhone_number).toBe(responseDto.phone_number);
    expect(savedStore.getName).toBe(responseDto.name);
  });

  it("Should not save Store and throw ConflictException", async () => {
    expect.assertions(1);

    const savedStore = new Store();
    savedStore.setName = NAME;
    savedStore.setAddress = ADDRESS;
    savedStore.setTables = TABLES;
    savedStore.setPhone_number = PHONE_NUMBER;
    await storeRepository.save(savedStore);

    const dto = new StoreCreateDto();
    dto.name = NAME;
    dto.address = ADDRESS;
    dto.tables = TABLES;
    dto.phone_number = PHONE_NUMBER;

    try {
      await storeService.saveStore(dto, 1234);
    } catch (exception) {
      expect(exception).toBeInstanceOf(ConflictException);
    }
  });  

  it("Should get store info correctly", async () => {
    let savedStore = new Store();
    savedStore.setAddress = ADDRESS;
    savedStore.setName = NAME;
    savedStore.setTables = TABLES;
    savedStore.setPhone_number = PHONE_NUMBER;
    savedStore = await storeRepository.save(savedStore);
  
    const response = await storeService.getStoreInfo(savedStore.getStore_id);
    expect(response.store_id).toBe(savedStore.getStore_id);
    expect(response.address).toBe(savedStore.getAddress);
    expect(response.name).toBe(savedStore.getName);
  });

  it("Should throw NotFoundException if store_id is invalid", async () => {
    expect.assertions(1);
    try {
      await storeService.getStoreInfo(-1);
    } catch (exception) {
      expect(exception).toBeInstanceOf(NotFoundException);
    }
  });

  it("Should update store infos(name and address and tables phone_number)", async () => {
    const savedStore = await saveStore();

    const updateDto = new StoreUpdateDto();
    updateDto.name = "NEW_NAME";
    updateDto.address = "NEW_ADDRESS";
    updateDto.tables = 100;
    updateDto.phone_number = "01087654321"

    const response = await storeService.updateStoreInfo(
      savedStore.getStore_id,
      updateDto
    );

    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedStore = await storeRepository.findOne(savedStore.getStore_id);
    expect(updatedStore.getName).toBe("NEW_NAME");
    expect(updatedStore.getAddress).toBe("NEW_ADDRESS");
    expect(updatedStore.getTables).toBe(100);
    expect(updatedStore.getPhone_number).toBe("01087654321");
  });

  it("Should remove store", async () => {
    const savedStore = await saveStore();

    const response = await storeService.removeStore(savedStore.getStore_id);
    expect(response).toBeInstanceOf(BasicMessageDto);

    const store = await storeRepository.findOne(savedStore.getStore_id);
    expect(store).toBeUndefined();
  });
});
