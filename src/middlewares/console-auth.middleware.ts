import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { NextFunction } from "express";
import { Store } from "src/entities/store/store.entity";
import IStoreRequest from "src/interfaces/store-request";
import { extractUserId } from "src/utils/auth/jwt-token-util";
import { getRepository } from "typeorm";

@Injectable()
export class ConsoleAuthMiddleware implements NestMiddleware {
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
  private checkUserId = async (storeId: number): Promise<number> => {
    const store = getRepository(Store);
    const store_temp = await store.findOne({
      where: {
        store_id: storeId,
      },
      relations: ["user", "menus", "categories", "optionGroups"],
    });
    const user_id = store_temp.user.getUser_id;

    return user_id;
  };

  async use(req: IStoreRequest, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers["authorization"];
    const storeId = req.headers["storeid"];
    if (!!authorizationHeader) {
      const token = this.checkSchemaAndReturnToken(authorizationHeader);
      req.userId = extractUserId(token);
      req.accessToken = token;

      const user_id = await this.checkUserId(storeId);

      if (user_id != req.userId) {
        throw new BadRequestException("storeid Header is wrong.");
      }
      next();
    } else throw new BadRequestException("Authorization Header is missing.");
  }
}
