import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionInterceptor } from "src/interceptor/transaction.interceptor";
import { Connection } from "typeorm";
import { Menu } from "../../../src/entities/menu/menu.entity";
import { UserAuthMiddleware } from "../../../src/middlewares/user-auth.middleare";
import { MenuController } from "./menu.controller";
import { MenuService } from "./menu.service";

@Module({
  imports: [TypeOrmModule.forFeature([Menu])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {

}
