import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { EventModule } from './event/event.module';
import { OptionModule } from './option/option.module';



@Module({
  imports: [CategoryModule,EventModule,OptionModule],
  providers: []
})
export class ConsoleModule {}
