import { IsDate, IsString } from "class-validator";

export class EnableTimeCreateDto{
    @IsDate()
    start_time: Date;
    @IsDate()
    end_time: Date;
    @IsString()
    description: string;
}