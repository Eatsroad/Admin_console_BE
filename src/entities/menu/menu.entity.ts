import { 
    Column, 
    CreateDateColumn, 
    DeleteDateColumn, 
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
  } from "typeorm";
import { Store } from "../store/store.entity";
//테이블생성,get함수set함수생성
  @Entity({name: "menus"})
  export class Menu{
      @PrimaryGeneratedColumn()
      private menu_id: number;

      @OneToMany(type => Store, store => store.getStore_id)
      store_id: Store;

      @OneToMany(type => Category, category => category.getCategory_id)
      category_id: Category;

      @ManyToMany(type => Optiongroup, optiongroup => optiongroup.getOptiongroup_id)//cascade하면안됌
      option_group_id : Optiongroup:

      @ManyToMany(type => Eventgroup, eventgroup => eventgroup.getEventgroup_id)
      event_group_id : Eventgroup;

      @Column({nullable : false})
      private name : string;

      @Column({nullable : false})
      private price : number;

      @Column({nullable : false})
      private desc : string;

      @Column({nullable : false})
      private state : boolean; 

      get getMenu_id(): number {
        return this.menu_id;
      }
      get getName(): string {
        return this.name;
      }
      get getPrice(): number {
        return this.price;
      }
      get getDesc(): string {
        return this.desc;
      }
      get getState(): boolean {
        return this.state;
      }
      get getCategory_id():number {
        return this.category_id;
      }
      get getOption_group_id():number{
        return this.option_group_id;
      }
      get getEvent_group_id():number{
        return this.event_group_id;
      }
      set setMenu_id(menu_id:number) {
        this.menu_id = menu_id;
      }
      set setName(name: string) {
        this.name = name;
      }
      set setPrice(price: number) {
        this.price = price;
      }
      set setDesc(desc: string) {
        this.desc = desc;
      }
      set setState(state: boolean) {
       this.state = state;
      }
      set setCategory_id(category_id:number) {
        this.category_id= category_id;
      }
      set setOption_group_id(option_group_id:number){
        this.option_group_id = option_group_id;
      }
      set setEvent_group_id(event_group_id : number){
        this.event_group_id=event_group_id;
      }
    }