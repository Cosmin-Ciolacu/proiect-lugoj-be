import { IsString, IsEmail } from "class-validator";

export class RegisterBody {
  @IsString()
  username: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  accountType: string;
}
