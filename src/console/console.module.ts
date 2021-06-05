import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { EventModule } from './event/event.module';
import { OptionModule } from './option/option.module';
import { StoreModule } from './store/store.module';



@Module({
  imports: [CategoryModule,EventModule,OptionModule, StoreModule],
  providers: []
})
export class ConsoleModule {}
