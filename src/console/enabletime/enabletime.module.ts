import { Module } from '@nestjs/common';
import { EnabletimeService } from './enabletime.service';
import { EnabletimeController } from './enabletime.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnableTime } from 'src/entities/menu/enableTime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EnableTime])],
  providers: [EnabletimeService],
  controllers: [EnabletimeController]
})
export class EnabletimeModule {}
