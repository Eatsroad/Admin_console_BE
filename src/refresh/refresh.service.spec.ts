import { Test, TestingModule } from "@nestjs/testing";
import { RefreshToken } from "../../src/entities/token/token.entity";
import { User } from "../../src/entities/user/user.entity";
import { createMemoryDB } from "../../src/utils/connections/create-memory-db";
import { Connection, Repository } from "typeorm";
import { RefreshService } from "./refresh.service";

describe("RefreshService", () => {
  let refreshService: RefreshService;
  let connection: Connection;
  let refreshRepository: Repository<RefreshToken>;

  // const TOKEN_ID = 'NAME';
  // const REFRESHTOKEN = 'test@test.com';
  // const USERID = '1234abc5';
  // const PHONE_NUMBER = '010-7725-1929';
  // const USER_ROLE = "USER";

  // const saveUser = async (): Promise<User> => {
  //   const savedUser = new User();

  //   savedUser.setEmail = EMAIL;
  //   savedUser.setName = NAME;
  //   savedUser.setPassword = PASSWORD;
  //   savedUser.setPhone_number = PHONE_NUMBER;
  //   savedUser.setUserRole = USER_ROLE;

  //   return await userRepository.save(savedUser);

  beforeAll(async () => {
    connection = await createMemoryDB([RefreshToken]);
    refreshRepository = await connection.getRepository(RefreshToken);
    refreshService = new RefreshService(refreshRepository);
  });

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [RefreshService],
  //   }).compile();

  //   service = module.get<RefreshService>(RefreshService);
  // });

  it("should be defined", () => {
    expect(refreshService).toBeDefined();
  });

  afterAll(async () => {
    await connection.close();
  });
});
