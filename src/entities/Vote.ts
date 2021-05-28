import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  BaseEntity,
} from "typeorm";

@Entity("votes")
export class Vote extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column() userId: number;
  @Column() problemId: number;
  @Column() vote: string;
  @CreateDateColumn({ name: "created_at" }) createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" }) updatedAt: Date;

  static async isProblemVoted(
    userId: number,
    problemId: number
  ): Promise<boolean> {
    const isVoted = await this.createQueryBuilder("vote")
      .where("vote.userId = :userId", { userId })
      .andWhere("vote.problemId = :problemId", { problemId })
      .getOne();
    return isVoted ? true : false;
  }
  static async getPositiveVotes(problemId: number): Promise<number> {
    return await this.createQueryBuilder("vote")
      .where("vote.problemId = :problemId", { problemId })
      .andWhere("vote.vote = :vote", { vote: "Y" })
      .getCount();
  }

  static async getNegativeVotes(problemId: number): Promise<number> {
    return await this.createQueryBuilder("vote")
      .where("vote.problemId = :problemId", { problemId })
      .andWhere("vote.vote = :vote", { vote: "N" })
      .getCount();
  }
}
