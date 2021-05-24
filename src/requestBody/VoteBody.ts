import { IsNumber, IsString } from "class-validator";

export class VoteBody {
  @IsNumber() problemId: number;
  @IsString() vote: string;
}
