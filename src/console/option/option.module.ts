import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from 'src/entities/option/option.entity';
import { OptionController } from './option.controller';
import { OptionService } from './option.service';

@Module({
  imports: [TypeOrmModule.forFeature([Option])],
  providers: [OptionService],
  controllers: [OptionController],
  
})
export class OptionModule {}
