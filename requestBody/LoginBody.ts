import { IsEmail, IsString } from "class-validator";
export class LoginBody {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
