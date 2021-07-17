import { EnableTime } from "src/entities/menu/enableTime.entity";


export class EnableTimeInfoResponseDto{
    constructor( enabletime : EnableTime ){
        this.id = enabletime.getEnableTimeId
        this.start_time = enabletime.getStartTime;
        this.end_time = enabletime.getEndTime;
        this.description = enabletime.getEnableTimeDesc;
    }
    id: number;
    start_time: Date;
    end_time: Date;
    description: string;
}

