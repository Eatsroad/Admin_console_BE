import { ShutdownSignal } from "@nestjs/common";
import { isHexColor } from "class-validator";
import { 
  Column,
  Entity, 
  JoinColumn, 
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

  @Column({nullable: true})
  private state: string;

  @ManyToOne(() => Store, store => store.getStore_id)
  @JoinColumn({name: "store_id"})
  store_id : Store;

  @OneToOne(() => EnableTime, enableTime => enableTime.getEnableTimeId,{
    cascade: [ "update" ]
  })
  @JoinColumn({name: "enable_time"})
  enable_time: EnableTime;

  @ManyToMany(() => Category,)
  @JoinTable({
    name: "menus_and_categories",
    joinColumn: {
      name: "menu_id",
      referencedColumnName: "menu_id"
    },
    inverseJoinColumn: {
      name: "category_id",
      referencedColumnName: "category_id"
    }
    },
  )
  categories: Category[];
  
  @ManyToMany(() => OptionGroup)
  @JoinTable({
    name: "menus_and_option_groups",
    joinColumn: {
      name: "menu_id",
      referencedColumnName: "menu_id"
    },
    inverseJoinColumn: {
      name: "option_group_id",//데이터그립에있는 optiongroup테이블에 있는 속성이름
      referencedColumnName: "option_group_id"//optiongroup엔티티에있는 PK속성이름
    }
    },
    )
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

  get getMenuState(): string {
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

  set setMenuState(state: string) {
    this.state = state;
  }

  
}
