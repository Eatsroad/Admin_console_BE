import { ShutdownSignal } from "@nestjs/common";
import { isHexColor } from "class-validator";
import { 
  Column,
  Entity, 
  JoinTable, 
  ManyToMany, 
  ManyToOne, 
  OneToOne, 
  PrimaryGeneratedColumn 
} from "typeorm";
import { Category } from "../category/category.entity";
import { OptionGroup } from "../option/optionGroup.entity";
import { Store } from "../store/store.entity";
import { EnableTime } from "./enableTime.entity";

@Entity({name: "menus"})
export class Menu {
  @PrimaryGeneratedColumn()
  private menu_id: number;

  @Column({nullable: false})
  private name: string;

  @Column({nullable: false})
  private price: number;

  @Column({nullable: true})
  private description: string;

  @Column({default: true})
  private state: boolean;

  @ManyToOne(() => Store, store => store.getStore_id)
  store_id: Store;

  @OneToOne(() => EnableTime, enableTime => enableTime.getEnableTimeId)
  enable_time: EnableTime;

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];
  
  @ManyToMany(() => OptionGroup)
  @JoinTable()
  optionGroups: OptionGroup[];

  get getMenuId(): number {
    return this.menu_id;
  }
  get getMenuName(): string {
    return this.name;
  }
  get getMenuPrice(): number {
    return this.price;
  }
  get getMenuDesc(): string {
    return this.description;
  }
  get getMenuState(): boolean {
    return this.state;
  }

  set setMenuName(name: string) {
    this.name = name;
  }
  set setMenuPrice(price: number) {
    this.price = price;
  }
  set setMenuDesc(description: string) {
    this.description = description;
  }
  set setMenuState(state: boolean) {
    this.state = state;
  }
}