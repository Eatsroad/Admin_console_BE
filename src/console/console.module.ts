import { Module } from '@nestjs/common';
import { MenuModule } from './menu/menu.module';
import { CategoryModule } from './category/category.module';
import { EventModule } from './event/event.module';
import { OptionModule } from './option/option.module';
import { StoreModule } from './store/store.module';
import { OptiongroupModule } from './optiongroup/optiongroup.module';
import { EnabletimeModule } from './enabletime/enabletime.module';

@Module({
  imports: [ MenuModule, CategoryModule, EventModule, OptionModule, StoreModule, OptiongroupModule, EnabletimeModule],
  providers: []
})
export class ConsoleModule {}
