import { IsString, MinLength } from "class-validator";

export class LoginDto {
  /** Full name OR WhatsApp number. */
  @IsString()
  @MinLength(2)
  identifier!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}
