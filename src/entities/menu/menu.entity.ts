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
import { Category } from "../category/category.entity";
import { Store } from "../store/store.entity";
//테이블생성,get함수set함수생성
  @Entity({name: "menus"})
  export class Menu{
      @PrimaryGeneratedColumn()
      private menu_id: number;

      @OneToMany(type => Store, store => store.getStore_id)
      store_id: number;

      @OneToMany(type => Category, category => category.getCategory_id)
      category_id: number;

      // @OneToMany(type => Eventgroup, eventgroup => eventgroup.getEventgroup_id)//cascade하면안됌
      // event_group_id : Eventgroup;

      @Column({nullable : false})
      private name : string;

      @Column({nullable : false})
      private price : number;

      @Column({nullable : false})
      private desc : string;

      @Column({nullable : false})
      private state : string; 

      @Column({nullable : false})
      private enable_time : number; 

      get getStore_id() : number{
        return this.store_id;
      }
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
      get getState(): string {
        return this.state;
      }
      get getCategory_id(): number {
        return this.category_id;
      }
      get getEnable_time() : number{
        return this.enable_time;
      }
      
      // get getEvent_group_id():number{
      //   return this.event_group_id;
      // }
      set setStore_id (store_id : number){
        this.store_id= store_id;
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
      set setState(state: string) {
       this.state = state;
      }
      set setEnable_time(enable_time: number) {
        this.enable_time = enable_time;
       }
      set setCategory_id(category_id : number) {
        this.category_id = category_id;
      }
      
      // set setEvent_group_id(event_group_id : number){
      //   this.event_group_id=event_group_id;
      // }
    }