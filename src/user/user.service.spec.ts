import { ConflictException, NotFoundException } from '@nestjs/common';
import { BasicMessageDto } from '../common/dtos/basic-massage.dto';
import { createMemoryDB } from '../utils/create-memory-db';
import { Connection, Repository } from 'typeorm';
import { UserCreateDto } from './dtos/create-user.dto';
import { UserUpdateDto } from './dtos/update-user.dto';
import { UserService } from './user.service';
import { User } from '../entities/user/user.entity';

describe('UserService', () => {
  let userService: UserService;
  let connection: Connection;
  let userRepository: Repository<User>;

  const NAME = 'NAME';
  const EMAIL = 'test@test.com';
  const PASSWORD = '1234abc5';
  const PHONE_NUMBER = '010-7725-1929';
  // const WRONG_TOKEN = 'asdfasdf';

  const saveUser = async (): Promise<User> => {
    const savedUser = new User();
    savedUser.setEmail = EMAIL;
    savedUser.setName = NAME;
    savedUser.setPassword = PASSWORD;
    savedUser.setPhone_number = PHONE_NUMBER;
    return await userRepository.save(savedUser);
  };

  beforeAll(async () => {
    connection = await createMemoryDB([User]);
    userRepository = await connection.getRepository(User);
    userService = new UserService(userRepository);
  });

  afterAll(async () => {
    await connection.close();
  });

  afterEach(async () => {
    await userRepository.query("DELETE FROM users");
  });

  it("should be defined", () => {
    expect(userService).toBeDefined();
  });

  it("Should Save User", async () => {
    const dto = new UserCreateDto();
    dto.name = NAME;
    dto.email = EMAIL;
    dto.password = PASSWORD;
    dto.phone_number = PHONE_NUMBER;

    const responseDto = await userService.saveUser(dto);

    expect(responseDto.name).toBe(NAME);
    expect(responseDto.email).toBe(EMAIL);
    expect(typeof responseDto.user_id).toBe("number");
    expect(responseDto.phone_number).toBe(PHONE_NUMBER);

    const savedUser = await userRepository.findOne(responseDto.user_id);

    expect(savedUser.getUser_id).toBe(responseDto.user_id);
    expect(savedUser.getName).toBe(responseDto.name);
    expect(savedUser.getEmail).toBe(responseDto.email);
    expect(savedUser.getPassword).toBe(PASSWORD);
    expect(savedUser.getPhone_number).toBe(responseDto.phone_number);
  });
  
  it("Should not save user and throw ConflictException", async () => {
    expect.assertions(1);

    const savedUser = new User();
    savedUser.setEmail = EMAIL;
    savedUser.setName = NAME;
    savedUser.setPassword = PASSWORD;
    savedUser.setPhone_number = PHONE_NUMBER;
    await userRepository.save(savedUser);

    const dto = new UserCreateDto();
    dto.name = NAME;
    dto.email = EMAIL;
    dto.password = PASSWORD;
    dto.phone_number = PHONE_NUMBER;

    try {
      await userService.saveUser(dto);
    } catch (exception) {
      expect(exception).toBeInstanceOf(ConflictException);
    }
  });

  it("Should get user info correctly", async () => {
    let savedUser = new User();
    savedUser.setEmail = EMAIL;
    savedUser.setName = NAME;
    savedUser.setPassword = PASSWORD;
    savedUser.setPhone_number = PHONE_NUMBER;
    savedUser = await userRepository.save(savedUser);
  
    const response = await userService.getUserInfo(savedUser.getUser_id);
    expect(response.user_id).toBe(savedUser.getUser_id);
    expect(response.email).toBe(savedUser.getEmail);
    expect(response.name).toBe(savedUser.getName);
  });
  it("Should throw NotFoundException if user_id is invalid", async () => {
    expect.assertions(1);
    try {
      await userService.getUserInfo(-1);
    } catch (exception) {
      expect(exception).toBeInstanceOf(NotFoundException);
    }
  });

  it("Should update user infos(Both name and password)", async () => {
    const savedUser = await saveUser();

    const updateDto = new UserUpdateDto();
    updateDto.name = "NEW_NAME";
    updateDto.password = "NEW_PASSWORD";

    const response = await userService.updateUserInfo(
      savedUser.getUser_id,
      updateDto
    );

    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedUser = await userRepository.findOne(savedUser.getUser_id);
    expect(updatedUser.getName).toBe("NEW_NAME");
    expect(updatedUser.getPassword).toBe("NEW_PASSWORD");
  });

  it("Should update user info(Only name)", async () => {
    const savedUser = await saveUser();

    const updateDto = new UserUpdateDto();
    updateDto.name = "NEW_NAME";

    const response = await userService.updateUserInfo(
      savedUser.getUser_id,
      updateDto
    );
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedUser = await userRepository.findOne(savedUser.getUser_id);
    expect(updatedUser.getName).toBe("NEW_NAME");
    expect(updatedUser.getPassword).toBe(PASSWORD);
  });

  it("Should update user info(Only password)", async () => {
    const savedUser = await saveUser();

    const updateDto = new UserUpdateDto();
    updateDto.password = "NEW_PASSWORD";

    const response = await userService.updateUserInfo(
      savedUser.getUser_id,
      updateDto
    );
    expect(response).toBeInstanceOf(BasicMessageDto);

    const updatedUser = await userRepository.findOne(savedUser.getUser_id);
    expect(updatedUser.getName).toBe(NAME);
    expect(updatedUser.getPassword).toBe("NEW_PASSWORD");
  });

  it("Should remove user", async () => {
    const savedUser = await saveUser();

    const response = await userService.removeUser(savedUser.getUser_id);
    expect(response).toBeInstanceOf(BasicMessageDto);

    const user = await userRepository.findOne(savedUser.getUser_id);
    expect(user).toBeUndefined();
  });
});