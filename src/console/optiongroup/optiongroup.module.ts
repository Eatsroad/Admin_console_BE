import { Module } from '@nestjs/common';
import { OptiongroupService } from './optiongroup.service';
import { OptiongroupController } from './optiongroup.controller';

@Module({
  providers: [OptiongroupService],
  controllers: [OptiongroupController]
})
export class OptiongroupModule {}
