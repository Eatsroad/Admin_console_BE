import { 
    Column, 
    Entity, 
    PrimaryGeneratedColumn, 
  } from "typeorm";
//테이블생성,get함수set함수생성

export enum CategoryRole {
    SET_1 = "SET_1",
    SET_2 = "SET_2",
    SET_3 = "SET_3",
  }

  @Entity({name: "categories"})
  export class Category{
      @PrimaryGeneratedColumn()
      private category_id: number;

      @Column({nullable : false})
      private name : string;

      @Column({nullable : false})
      private desc : string;

      @Column({nullable: false, 
        type: "enum",
        enum: CategoryRole,
        default: CategoryRole.SET_1,
        })
        private role: string;

      @Column({nullable : false})
      private state : boolean; 

      get getCategory_id(): number {
        return this.category_id;
      }
      get getName(): string {
        return this.name;
      }
      get getDesc(): string {
        return this.desc;
      }
      get getRole(): string {
        return this.role;
      }
      get getState(): boolean {
        return this.state;
      }
      set setCategory_id(category_id:number) {
        this.category_id = category_id;
      }
      set setName(name: string) {
        this.name = name;
      }
      set setDesc(desc: string) {
        this.desc = desc;
      }
      set setRole(role: CategoryRole){
        this.role = role;
      }
      set setState(state: boolean) {
       this.state = state;
      }
      
    }