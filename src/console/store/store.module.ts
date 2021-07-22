import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Store } from "../../../src/entities/store/store.entity";
import { User } from "../../../src/entities/user/user.entity";
import { StoreController } from "./store.controller";
import { StoreService } from "./store.service";

@Module({
  imports: [TypeOrmModule.forFeature([Store, User])],
  providers: [StoreService],
  controllers: [StoreController],
})
export class StoreModule {
  // configure(consumer : MiddlewareConsumer){
  //   consumer
  //   .apply(StoreAuthMiddleware)
  //   .forRoutes(StoreController);
  // }
}
