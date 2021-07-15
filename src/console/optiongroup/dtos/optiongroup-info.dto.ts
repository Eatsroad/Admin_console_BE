import { MenuPreviewInfo } from "src/console/menu/dtos/menu-info.dto";
import { OptionPreviewInfo } from "src/console/option/dtos/option-info.dto";
import { Option } from "src/entities/option/option.entity";
import { OptionGroup } from "../../../../src/entities/option/optionGroup.entity";

export interface OptionGroupPreviewInfo {
    name: string;
    option_group_id: number;
};

export class getAllOptionGroupListDto{
    constructor(optiongroup: OptionGroup){
        this.option_group_id = optiongroup.getOptionGroupId;
        this.name = optiongroup.getOptionGroupName;
        this.menus = optiongroup.getMenusPreviewInfo;
        this.option_id = optiongroup.getOptionsPreviewInfo;
    }

    option_group_id : number;
    name: string;
    menus: MenuPreviewInfo[];
    option_id: OptionPreviewInfo[];

}

export class OptionGroupInfoResponseDto{
    constructor(optiongroup: OptionGroup){
        this.option_group_id = optiongroup.getOptionGroupId;
        this.name = optiongroup.getOptionGroupName;
        this.description = optiongroup.getOptionGroupDesc;
        this.state = optiongroup.getOptionGroupState;
        this.option_id = optiongroup.getOptionsPreviewInfo;
    }
    option_group_id : number;
    name: string;
    description:string;
    state: string;
    option_id: OptionPreviewInfo[];
}

