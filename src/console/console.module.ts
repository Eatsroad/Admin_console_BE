import { MiddlewareConsumer, Module } from "@nestjs/common";
import { MenuModule } from "./menu/menu.module";
import { CategoryModule } from "./category/category.module";
import { EventModule } from "./event/event.module";
import { OptionModule } from "./option/option.module";
import { StoreModule } from "./store/store.module";
import { OptiongroupModule } from "./optiongroup/optiongroup.module";
import { EnabletimeModule } from "./enabletime/enabletime.module";
import { StoreAuthMiddleware } from "src/middlewares/store-auth.middleware";
import { StoreController } from "./store/store.controller";
import { UserController } from "src/user/user.controller";
import { OptiongroupController } from "./optiongroup/optiongroup.controller";
import { OptionController } from "./option/option.controller";
import { MenuController } from "./menu/menu.controller";
import { CategoryController } from "./category/category.controller";
import { EnabletimeController } from "./enabletime/enabletime.controller";
import { EventController } from "./event/event.controller";
import { ConsoleAuthMiddleware } from "src/middlewares/console-auth.middleware";

@Module({
  imports: [
    MenuModule,
    CategoryModule,
    EventModule,
    OptionModule,
    StoreModule,
    OptiongroupModule,
    EnabletimeModule,
  ],
  providers: [],
})
export class ConsoleModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ConsoleAuthMiddleware)
      .forRoutes(
        StoreController,
        OptiongroupController,
        OptionController,
        MenuController,
        EventController,
        CategoryController,
        EnabletimeController
      );
  }
}
