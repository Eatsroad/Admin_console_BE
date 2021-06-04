import { 
    Column, 
    Entity, 
    PrimaryGeneratedColumn, 
  } from "typeorm";

export enum CategoryRole {
    BIG = "BIG",
    SMALL = "SMALL",
    ETC = "ETC",
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
        default: CategoryRole.BIG,
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