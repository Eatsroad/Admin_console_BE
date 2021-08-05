import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "refresh_token" })
export class RefreshToken {
  @PrimaryGeneratedColumn()
  private token_id: number;

  @Column({ nullable: false })
  private refreshtoken: string;

  @Column({ nullable: false })
  private user_id: number;

  get gettoken_id(): number {
    return this.token_id;
  }

  get getrefreshtoken(): string {
    return this.refreshtoken;
  }

  get getuser_id(): number {
    return this.user_id;
  }

  set setrefreshtoken(refreshtoken: string) {
    this.refreshtoken = refreshtoken;
  }

  set setuser_id(user_id: number) {
    this.user_id = user_id;
  }
}
