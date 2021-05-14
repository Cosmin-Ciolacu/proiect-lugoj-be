import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  BaseEntity,
} from "typeorm";
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column() username: string;
  @Column() email: string;
  @Column() password: string;
  @Column({ name: "account_type" }) accountType: string;
  @CreateDateColumn({ name: "created_at" }) createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" }) updatedAt: Date;

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
}
