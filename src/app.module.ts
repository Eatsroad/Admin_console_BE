import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { ConsoleModule } from "./console/console.module";
import { ClientModule } from "./client/client.module";
import { RefreshModule } from "./refresh/refresh.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    ConsoleModule,
    ClientModule,
    RefreshModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
