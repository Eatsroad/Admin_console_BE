import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OptionGroup } from "./optionGroup.entity";

@Entity({name: "options"})
export class Option {
  @PrimaryGeneratedColumn()
  private options_id: number;

  @Column({nullable: false})
  private name: string;

  @Column({nullable: false})
  private price: number;

  @Column({default: true})
  private state: boolean;

  @ManyToOne(() => OptionGroup, optionGroup => optionGroup.getOptionGroupId)
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
  get getOptionState(): boolean {
    return this.state;
  }

  set setOptionName(name: string) {
    this.name = name;
  }
  set setOptionPrice(price: number) {
    this.price = price;
  }
  set setOptionState(state: boolean) {
    this.state = state;
  } 
}