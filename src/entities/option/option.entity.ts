import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OptionGroup } from "./optionGroup.entity";

@Entity({name: "options"})
export class Option {
  @PrimaryGeneratedColumn()
  private options_id: number;

  @Column({nullable: false})
  private name: string;

  @Column({nullable: false})
  private price: number;

  @Column({nullable: true})
  private state: string;

  @ManyToOne(() => OptionGroup, optionGroup => optionGroup.getOptionGroupId)
  @JoinColumn({name:"option_group_id"})
  option_group_id: OptionGroup[];

  get getOptionId(): number {
    return this.options_id;
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