import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Problem } from "./Problem";
import { verify } from "jsonwebtoken";
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column() username: string;
  @Column() email: string;
  @Column() password: string;
  @Column({ name: "account_type", nullable: true }) accountType: string;
  @CreateDateColumn({ name: "created_at" }) createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" }) updatedAt: Date;
  @OneToMany(() => Problem, (problem) => problem.user)
  problems: Problem[];

  static async existsUser(email: string): Promise<boolean> {
    const user = await this.createQueryBuilder("user")
      .where("user.email = :email", { email: email })
      .getOne();
    return user ? true : false;
  }

  static async findByEmail(email: string): Promise<User> {
    const user = await this.createQueryBuilder("user")
      .where("user.email = :email", { email: email })
      .getOne();
    return user;
  }

  static async getUserByToken(token: string): Promise<User> {
    let user: User;
    try {
      const payload: any = await verify(token, process.env.JWT_SECRET);
      user = await this.findByEmail(payload.email);
    } catch (error) {
      console.log(error);
    }
    return user;
  }
}
