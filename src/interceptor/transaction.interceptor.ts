import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import { Observable } from "rxjs";
import { Menu } from "src/entities/menu/menu.entity";
import { Connection, Repository } from "typeorm";
import { map } from 'rxjs/operators';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
    constructor(
        @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
        @InjectConnection() private readonly connection: Connection,
        private readonly queryRunner = connection.createQueryRunner(),
        ) {}

    async intercept(context: ExecutionContext, next: CallHandler) : Promise<Observable<any>>{
        await this.queryRunner.connect();
        await this.queryRunner.startTransaction();
        return next
            .handle()
            .pipe(
                map(async (data)=>
                {
                    console.log(data); 
                    await this.queryRunner.commitTransaction();
                    await this.queryRunner.release();
                }),
            );

    }
}