import { IsNumber, IsString, IsOptional } from "class-validator";

export class ProblemBody {
  @IsString() category: string;
  @IsString() subCategory: string;
  @IsNumber() lat: number;
  @IsNumber() lng: number;
  @IsString() image: string;
  @IsString()
  @IsOptional()
  observations: string;
}
