import { OptionGroup } from "../../../../src/entities/option/optionGroup.entity";

export interface OptionGroupPreviewInfo {
    name: string;
    option_group_id: number;
};

export class OptionGroupInfoResponseDto{
    constructor(optiongroup: OptionGroup){
        this.name = optiongroup.getOptionGroupName;
        this.description = optiongroup.setOptionGroupDesc;
        this.state = optiongroup.getOptionGroupState
    }
    name: string;
    description:string;
    state: string;
}