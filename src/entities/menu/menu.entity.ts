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

<<<<<<< HEAD
  @ManyToOne(() => Store, store => store.menu_id)
=======
  @ManyToOne(() => Store, store => store.menus)
>>>>>>> 126f3dabbf6d8c8ef56acca10283db5919a4d1bd
  @JoinColumn({name: "store_id"})
  store_id : Store;

  @OneToOne(() => EnableTime, enableTime => enableTime.getEnableTimeId, {
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
      name: "option_group_id",
      referencedColumnName: "option_group_id"
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
