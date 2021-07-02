import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

  @OneToMany(() => Option, option => option.getOptionId)
  option_id: Option[];

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