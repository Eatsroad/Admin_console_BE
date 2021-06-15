import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from 'src/entities/menu/menu.entity';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';

@Module({
    imports:[TypeOrmModule.forFeature([Menu])],
    controllers: [MenuController],
    providers: [MenuService],
})
export class MenuModule {
    
}
