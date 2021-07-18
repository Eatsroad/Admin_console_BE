import { Module } from '@nestjs/common';
import { MenuboardModule } from './menuboard/menuboard.module';

@Module({
  imports: [MenuboardModule]
})
export class ClientModule {}
