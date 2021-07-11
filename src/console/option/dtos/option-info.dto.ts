import { OptionGroupPreviewInfo } from "src/console/optiongroup/dtos/optiongroup-info.dto";
import { Option } from "src/entities/option/option.entity";
export interface OptionPreviewInfo {
    name: string;
    option_id: number;
};

export class OptionInfoResponseDto{
    constructor(option: Option){
        this.option_id = option.getOptionId;
        this.option_group_id = option.getOptionGroupsPreviewInfo;
        this.name = option.getOptionName;
        this.price = option.getOptionPrice;
        this.state = option.getOptionState;
    }
    option_id: number;
    option_group_id: OptionGroupPreviewInfo[];
    name: string;
    price: number;
    state: string;
}