// import {
//   BadRequestException,
//   Injectable,
//   NestMiddleware,
//   UnauthorizedException,
// } from "@nestjs/common";
// import { NextFunction } from "express";
// import { Store } from "src/entities/store/store.entity";
// import IStoreRequest from "src/interfaces/store-request";
// import { extractUserId } from "src/utils/auth/jwt-token-util";
// import { getRepository } from "typeorm";

// @Injectable()
// export class StoreAuthMiddleware implements NestMiddleware {
//   private checkSchemaAndReturnToken(header: string): string {
//     const splitTemp = header.split(" ");
//     if (splitTemp[0] !== "Bearer") {
//       throw new UnauthorizedException(
//         "Authorization Header Schema must be Bearer."
//       );
//     } else {
//       return splitTemp[1];
//     }
//   }
//   use(req: IStoreRequest, res: Response, next: NextFunction) {
//     const authorizationHeader = req.headers["authorization"];
//     const storeId = req.headers["storeid"];
//     if (!!authorizationHeader) {
//       const token = this.checkSchemaAndReturnToken(authorizationHeader);
//       req.user_id = extractUserId(token);
//       req.accessToken = token;
//       next();
//     } else throw new BadRequestException("Authorization Header is missing.");
//   }
// }
