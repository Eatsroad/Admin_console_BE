import { 
  Column, 
  CreateDateColumn, 
  DeleteDateColumn, 
  Entity,
  // OneToMany, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";
// import { Store } from "../store/store.entity";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

@Entity({name: "users"})//name=실제테이블명 지정,테이블명은 users가 된다.
export class User {
  @PrimaryGeneratedColumn()
  private user_id: number;

  @Column({nullable: false})
  private name: string;

  @Column({nullable: false, unique: true})//nullable(null값가질수있는지),unique(유니크제약가지는지)는 속성,
  private email: string;

  @Column({nullable: false})
  private phone_number: string;

  @Column({nullable: false})
  private password: string;

  @Column({nullable: false, 
    type: "enum",
    enum: UserRole,
    default: UserRole.USER})
  private user_role: UserRole;

  @CreateDateColumn()
  private created_at: Date;

  @UpdateDateColumn()
  private updated_at: Date;

  @DeleteDateColumn()
  private deleted_at: Date;

  // @OneToMany(type => Store, store => store.getStore_id)
  // store_id: Store[];

  get getUser_id(): number {
    return this.user_id;
  }
  get getName(): string {
    return this.name;
  }
  get getEmail(): string {
    return this.email;
  }
  get getPassword(): string {
    return this.password;
  }
  get getPhone_number(): string {
    return this.phone_number;
  }
  get getUser_role(): string {
    return this.user_role;
  }
  get getCreated_at():Date {
    return this.created_at;
  }
  get getUpdated_at(): Date {
    return this.updated_at;
  }
  get getDeleted_at(): Date {
    return this.deleted_at;
  }

  set setName(name: string) {
    this.name = name;
  }
  set setEmail(email: string) {
    this.email = email;
  }
  set setPhone_number(phone_number: string) {
    this.phone_number = phone_number;
  }
  set setPassword(password: string) {
    this.password = password;
  }
  set setUserRole(user_role: UserRole) {
   this.user_role = user_role;
  }
}