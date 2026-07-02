import { PartialType } from "@nestjs/mapped-types";
import {
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateParticipantDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  /** Pick an existing school… */
  @IsOptional()
  @IsUUID()
  schoolId?: string;

  /** …or type a new one (service will find-or-create it). */
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  schoolName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) {
  @IsOptional()
  @IsIn(["active", "inactive"])
  status?: "active" | "inactive";
}
