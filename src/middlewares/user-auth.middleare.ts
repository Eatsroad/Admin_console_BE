import { 
  BadRequestException, 
  Injectable, 
  NestMiddleware, 
  UnauthorizedException 
} from "@nestjs/common";
import { NextFunction } from "express";
import { Store } from "src/entities/store/store.entity";
import { User } from "src/entities/user/user.entity";
import IUserRequest from "src/interfaces/user-request";
import { extractUserId } from "src/utils/auth/jwt-token-util";
import { getRepository } from "typeorm";

@Injectable()
export class UserAuthMiddleware implements NestMiddleware {
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

  private convert2storeIds(store: Store[]): number[]{
    let result: number[] = [];
    try{
      store.forEach((store) => {
        result.push(store.getStore_id)
      });
      return result;
    } catch (e){
      console.log(e);
    }
  }


  use(req: IUserRequest, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers["authorization"];
    if (!!authorizationHeader) {
      const token = this.checkSchemaAndReturnToken(authorizationHeader);
      req.accessToken = token;
        next();
    } else throw new BadRequestException("Authorization Header is missing.");
  }
}