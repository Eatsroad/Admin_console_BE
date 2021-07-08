import { Module } from '@nestjs/common';
import { OptiongroupService } from './optiongroup.service';
import { OptiongroupController } from './optiongroup.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionGroup } from 'src/entities/option/optionGroup.entity';

@Module({
  imports:[TypeOrmModule.forFeature([OptionGroup])],
  providers: [OptiongroupService],
  controllers: [OptiongroupController]
})
export class OptiongroupModule {}
