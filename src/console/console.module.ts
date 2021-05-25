import { Module } from '@nestjs/common';
import { ConsoleService } from './console.service';
import { ConsoleController } from './console.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/entities/store/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  providers: [ConsoleService],
  controllers: [ConsoleController]
})

export class ConsoleModule {}
//미드웨어는 필요없나? user에서 미들웨어를 왜 쓴 거지?