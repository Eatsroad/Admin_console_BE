import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction } from "express";
import { BasicMessageDto } from "src/common/dtos/basic-massage.dto";
import { Store } from "src/entities/store/store.entity";
import { RefreshToken } from "src/entities/token/token.entity";
import { User } from "src/entities/user/user.entity";
import ITokenRequest from "src/interfaces/token-request";
import IUserRequest from "src/interfaces/user-request";
import {
  checkExpDateRefresh,
  extractUserId,
  extractUserIdForRefresh,
} from "src/utils/auth/jwt-token-util";
import { getRepository, Repository } from "typeorm";
import * as jwt from "jsonwebtoken";

@Injectable()
export class RefreshAuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshtokenRepository: Repository<RefreshToken>
  ) {}

  private checkSchemaAndReturnToken(header: string): string {
    const splitTemp = header.split(" ");
    if (splitTemp[0] !== "Bearer") {
      throw new UnauthorizedException(
        "Authorization Header Schema must be Bearer."
      );
    } else {
      return splitTemp[1];
    }
  }

  private convert2storeIds(store: Store[]): number[] {
    let result: number[] = [];
    try {
      store.forEach((store) => {
        result.push(store.getStore_id);
      });
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  async use(req: ITokenRequest, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers["authorization"];
    const refreshtokenIndex = req.headers["refreshtoken_index"];
    if (!!authorizationHeader) {
      const token = this.checkSchemaAndReturnToken(authorizationHeader);
      console.log(1);
      console.log(token);
      req.userId = extractUserIdForRefresh(token);
      console.log(1234);
      const targettoken = await this.refreshtokenRepository
        .createQueryBuilder()
        .select("r")
        .from(RefreshToken, "r")
        .where("r.token_id =:refreshtokenIndex", { refreshtokenIndex })
        .getOne();
      console.log(1);
      if (targettoken === undefined) {
        const user_id = req.userId;
        const targettoken1 = await this.refreshtokenRepository
          .createQueryBuilder()
          .select("r")
          .from(RefreshToken, "r")
          .where("r.user_id =:user_id", { user_id })
          .getOne();
        try {
          await this.refreshtokenRepository.delete(targettoken1);
          throw new BadRequestException("Don't try bad things bixxx");
        } catch (e) {
          throw new BadRequestException("Don't try bad things bixxx");
        }
      }
      const refreshtoken = targettoken.getrefreshtoken;

      const decodedToken = jwt.verify(
        refreshtoken,
        `${process.env.REFRESH_TOKEN_SECRET}`
      ) as {
        userId: number;
        exp: number;
      };
      if (decodedToken.userId !== req.userId) {
        const user_id = req.userId;
        const targettoken1 = await this.refreshtokenRepository
          .createQueryBuilder()
          .select("r")
          .from(RefreshToken, "r")
          .where("r.user_id =:user_id", { user_id })
          .getOne();
        try {
          await this.refreshtokenRepository.delete(targettoken1);
        } catch (e) {
          throw new BadRequestException("Don't try bad things bixxx");
        }
        throw new BadRequestException("Don't try bad things bixxx");
      } else {
        try {
          await this.refreshtokenRepository.delete(targettoken);
        } catch (e) {
          console.log(e);
        } finally {
          checkExpDateRefresh(decodedToken.exp);
          next();
        }
      }
    } else throw new BadRequestException("Authorization Header is missing.");
  }
}
