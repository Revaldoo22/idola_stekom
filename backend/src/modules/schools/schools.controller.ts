import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { SchoolsService } from "./schools.service";
import { CreateSchoolDto } from "./dto/create-school.dto";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("admin/schools")
@UseGuards(JwtGuard, RolesGuard)
@Roles("admin")
export class SchoolsController {
  constructor(private readonly schools: SchoolsService) {}

  @Get()
  list() {
    return this.schools.list();
  }

  @Get("participant-counts")
  participantCounts() {
    return this.schools.participantCounts();
  }

  @Post()
  create(@Body() dto: CreateSchoolDto) {
    return this.schools.createOrGet(dto);
  }

  @Patch(":id")
  rename(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: CreateSchoolDto,
  ) {
    return this.schools.rename(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.schools.remove(id);
  }
}
