import { Module } from '@nestjs/common';
import { MenuModule } from './menu/menu.module';
import { CategoryModule } from './category/category.module';
import { EventModule } from './event/event.module';
import { OptionModule } from './option/option.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [ MenuModule, CategoryModule, EventModule, OptionModule, StoreModule],
  providers: []
})
export class ConsoleModule {}
