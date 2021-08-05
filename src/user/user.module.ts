import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserAuthMiddleware } from "../../src/middlewares/user-auth.middleare";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Store } from "../../src/entities/store/store.entity";
import { User } from "../../src/entities/user/user.entity";
import { RefreshToken } from "src/entities/token/token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Store, RefreshToken])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAuthMiddleware)
      .exclude(
        {
          path: "user",
          method: RequestMethod.POST,
        },
        {
          path: "user/signin",
          method: RequestMethod.POST,
        }
        // {
        //   path: "user/refresh",
        //   method: RequestMethod.POST,
        // }
      )
      .forRoutes(UserController);
  }
}
