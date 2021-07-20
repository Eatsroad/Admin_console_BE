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

  // private checkStoreId  = async (userId: number, store_id: number[]) : Promise<boolean> => {
  //   const store = getRepository(Store);
  //   const storeId =  await store.find({
  //     select:['getStore_id'],
  //     where: {
  //       user: userId,
  //     },
  //     relations:['user']
  //   });
  //   //store객체배열을 number배열로 변환
  //   const storeIds =  await this.convert2storeIds(storeId);
  //   return (store_id == storeIds);
  // }

  use(req: IUserRequest, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers["authorization"];
    // const StoreIdHeader = req.headers["sessionId"];//header의 어느부분에서 storeId를 넣어주는지?,storeId를 헤더에넣어서주는지?어떻게 준다고 했었지?"Cookie:store_id=13"
    if (!!authorizationHeader) {
      const token = this.checkSchemaAndReturnToken(authorizationHeader);
      req.accessToken = token;
      // if(this.checkStoreId(extractUserId(token), StoreIdHeader)){
        next();
      // }
      //  else throw new UnauthorizedException("Store Authorization is incorrect.");
    } else throw new BadRequestException("Authorization Header is missing.");
  }
}