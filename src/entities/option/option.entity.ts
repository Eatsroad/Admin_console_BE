import { OptionGroupPreviewInfo } from "src/console/optiongroup/dtos/optiongroup-info.dto";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "../store/store.entity";
import { OptionGroup } from "./optionGroup.entity";

@Entity({name: "options"})
export class Option {
  @PrimaryGeneratedColumn()
  private option_id: number;

  @Column({nullable: false})
  private name: string;

  @Column({nullable: false})
  private price: number;

  @Column({nullable: true})
  private state: string;

  @ManyToMany(() => OptionGroup)
  @JoinTable({
    name: "options_and_option_groups",
    joinColumn: {
      name: "option_id",
      referencedColumnName: "option_id"
    },
    inverseJoinColumn: {
      name: "option_group_id",
      referencedColumnName: "option_group_id"
    }
   },
  )
  option_group_id: OptionGroup[];

  @ManyToOne(() => Store, store => store.options)
  @JoinColumn({name:"store_id"})
  store: Store;

  get getOptionId(): number {
    return this.option_id;
  }
  get getOptionName(): string {
    return this.name;
  }
  get getOptionPrice(): number {
    return this.price;
  }
  get getOptionState(): string {
    return this.state;
  }

  get getOptionGroupsPreviewInfo(): OptionGroupPreviewInfo[] {
    let result: OptionGroupPreviewInfo[] = [];
    try {
      this.option_group_id.forEach((optiongroups) => {
        const data = {
          name: optiongroups.getOptionGroupName,
          option_group_id: optiongroups.getOptionGroupId
        };
        result.push(data);
      });
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  set setOptionName(name: string) {
    this.name = name;
  }
  set setOptionPrice(price: number) {
    this.price = price;
  }
  set setOptionState(state: string) {
    this.state = state;
  } 
}