import { Module } from '@nestjs/common';
import { MenuModule } from './menu/menu.module';
import { CategoryModule } from './category/category.module';
import { EventModule } from './event/event.module';
import { OptionModule } from './option/option.module';

@Module({
  imports: [ MenuModule, CategoryModule, EventModule, OptionModule],
  providers: []
})
export class ConsoleModule {}
