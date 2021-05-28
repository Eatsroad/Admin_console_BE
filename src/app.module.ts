import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuModule } from './menu/menu/menu.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, MenuModule],//typeormmodule.forroot()=nestjs어플리케이션이 시작될때 db설정파일을 확인하고 커넥션을 열어주느 작업을 수행하는 부분
  controllers: [],
  providers: [],
})
export class AppModule {}
