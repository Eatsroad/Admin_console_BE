import { MenuPreviewInfo } from "src/console/menu/dtos/menu-info.dto";
import { OptionPreviewInfo } from "src/console/option/dtos/option-info.dto";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Menu } from "../menu/menu.entity";
import { Store } from "../store/store.entity";
import { Option } from "./option.entity";

@Entity({name:"option_groups"})
export class OptionGroup {
  @PrimaryGeneratedColumn()
  private option_group_id: number;

  @Column({nullable: false})
  private name: string;

  @Column({nullable: true})
  private description: string;

  @Column({nullable: true})
  private state: string;

  @ManyToMany(() => Option)
  @JoinTable({
    name: "options_and_option_groups",
    joinColumn: {
      name: "option_group_id",
      referencedColumnName: "option_group_id"
    },
    inverseJoinColumn: {
      name: "option_id",
      referencedColumnName: "option_id"
    }
   },
  )
  option_id: Option[];

  @ManyToMany(() => Menu, menu => menu.optionGroups)
  menus: Menu[];

  @ManyToOne(() => Store, store => store.optionGroups)
  @JoinColumn({name:"store_id"})
  store: Store;

  get getOptionGroupId(): number {
    return this.option_group_id;
  }
  get getOptionGroupName(): string {
    return this.name;
  }
  get getOptionGroupDesc(): string {
    return this.description;
  }
  get getOptionGroupState(): string {
    return this.state;
  }

  get getOptionsPreviewInfo(): OptionPreviewInfo[] {
    let result: OptionPreviewInfo[] = [];
    try {
      this.option_id.forEach((options) => {
        const data = {
          name: options.getOptionName,
          option_id: options.getOptionId
        };
        result.push(data);
      });
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  get getMenusPreviewInfo(): MenuPreviewInfo[]{
    let result: MenuPreviewInfo[] = [];
    try{
      this.menus.forEach((menus)=>{
        const data = {
          name: menus.getMenuName,
          menu_id: menus.getMenuId
        };
        result.push(data);
      });
      return result;
    } catch (e){
      console.log(e);
    }
  }

  set setOptionGroupName(name: string) {
    this.name = name;
  }
  set setOptionGroupDesc(description: string) {
    this.description = description;
  }
  set setOptionGroupState(state: string) {
    this.state = state;
  }
}