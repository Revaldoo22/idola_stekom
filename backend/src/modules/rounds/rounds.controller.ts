import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { RoundsService } from "./rounds.service";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

class CreateRoundDto {
  @IsString()
  @MinLength(2, { message: "Nama gelombang minimal 2 karakter" })
  @MaxLength(100)
  name!: string;
}

class PopulateDto {
  @IsIn(["all", "gugur"])
  source!: "all" | "gugur";

  @IsOptional()
  @IsUUID()
  from_round_id?: string;
}

class CloseDto {
  @IsInt()
  @Min(1)
  @Max(100)
  top_n!: number;
}

@Controller("admin/rounds")
@UseGuards(JwtGuard, RolesGuard)
@Roles("admin")
export class RoundsController {
  constructor(private readonly rounds: RoundsService) {}

  @Get()
  list() {
    return this.rounds.list();
  }

  @Post()
  create(@Body() dto: CreateRoundDto) {
    return this.rounds.create(dto.name);
  }

  @Get(":id/standings")
  standings(@Param("id", ParseUUIDPipe) id: string) {
    return this.rounds.standings(id);
  }

  @Post(":id/populate")
  populate(@Param("id", ParseUUIDPipe) id: string, @Body() dto: PopulateDto) {
    return this.rounds.populate(id, dto.source, dto.from_round_id);
  }

  @Post(":id/activate")
  activate(@Param("id", ParseUUIDPipe) id: string) {
    return this.rounds.activate(id);
  }

  @Post(":id/close")
  close(@Param("id", ParseUUIDPipe) id: string, @Body() dto: CloseDto) {
    return this.rounds.close(id, dto.top_n);
  }

  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.rounds.remove(id);
  }
}

/** Endpoint publik: heatmap + round berjalan. */
@Controller("public")
export class PublicRoundsController {
  constructor(private readonly rounds: RoundsService) {}

  @Get("heatmap")
  heatmap(@Query("round_id") roundId?: string) {
    return this.rounds.heatmap(roundId || undefined);
  }

  @Get("active-round")
  async activeRound() {
    return (await this.rounds.active()) ?? null;
  }
}
