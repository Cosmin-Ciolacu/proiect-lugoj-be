import { IsArray } from "class-validator";

export class ProblemsNumbersBody {
  @IsArray()
  categories: string[];
}
