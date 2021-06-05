import { Module } from '@nestjs/common';
import { StoreModule } from './store/store.module';
import { ConsoleService } from './console/console.service';
import { MenuModule } from './menu/menu.module';
import { CategoryModule } from './category/category.module';
import { EventModule } from './event/event.module';
import { OptionModule } from './option/option.module';

@Module({
  imports: [StoreModule, MenuModule, CategoryModule, EventModule, OptionModule],
  providers: [ConsoleService]
})
export class ConsoleModule {}
