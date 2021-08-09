import { Test, TestingModule } from "@nestjs/testing";
import { RefreshToken } from "../../src/entities/token/token.entity";
import { User } from "../../src/entities/user/user.entity";
import { createMemoryDB } from "../../src/utils/connections/create-memory-db";
import { Connection, Repository } from "typeorm";
import { RefreshService } from "./refresh.service";
import * as jwt from "jsonwebtoken";

describe("RefreshService", () => {
  let refreshService: RefreshService;
  let connection: Connection;
  let refreshRepository: Repository<RefreshToken>;

  const USERID = 1;
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

  it("should issue accesstoken and refreshtoken", async () => {
    const dto = await refreshService.refresh(USERID);

    const decodedToken = jwt.verify(
      dto.accessToken,
      `${process.env.JWT_SERCET_KEY}`
    ) as {
      userId: number;
      exptime: number;
    };

    expect(decodedToken.userId).toBe(USERID);
    expect(dto.refreshTokenIndex).toBe(1);
  });
});
