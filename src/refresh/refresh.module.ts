import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefreshToken } from "src/entities/token/token.entity";
import { RefreshAuthMiddleware } from "src/middlewares/refresh-auth.middleware";
import { RefreshController } from "./refresh.controller";
import { RefreshService } from "./refresh.service";

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  controllers: [RefreshController],
  providers: [RefreshService],
})
export class RefreshModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshAuthMiddleware).forRoutes(RefreshController);
  }
}
