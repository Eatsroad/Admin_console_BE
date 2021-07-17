import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "src/entities/category/category.entity";
import { Menu } from "src/entities/menu/menu.entity";
import { OptionGroup } from "src/entities/option/optionGroup.entity";
import { Store } from "src/entities/store/store.entity";
import { MenuboardController } from "./menuboard.controller";
import { MenuboardService } from "./menuboard.service";
import { Option } from "src/entities/option/option.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Store, Category, Menu, OptionGroup, Option]),
  ],
  controllers: [MenuboardController],
  providers: [MenuboardService],
})
export class MenuboardModule {}
