import { CallHandler, ConflictException, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { Observable } from "rxjs";
import { Connection } from "typeorm";
import { map } from 'rxjs/operators';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        ) {}

    async intercept(context: ExecutionContext, next: CallHandler) : Promise<Observable<any>>{
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        return next
            .handle()
            .pipe(
                map(async (data) => 
                {
                    if(data instanceof Error){
                        await queryRunner.rollbackTransaction();
                        console.log("오류로 인하여 데이터가 등록되지 않았습니다.");
                        throw data;
                    } else {
                        await queryRunner.commitTransaction();
                        console.log("데이터베이스에 정상적으로 등록되었습니다.");
                        await queryRunner.release();
                        return data;
                    }
                }),
            );

    }
}