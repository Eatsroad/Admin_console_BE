import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor, Logger } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { Observable } from "rxjs";
import { Connection, Transaction } from "typeorm";
import { map } from 'rxjs/operators';
import { BasicMessageDto } from "src/common/dtos/basic-massage.dto";

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
                        await queryRunner.release();
                        return data;
                    }
                }),
            );

    }
}