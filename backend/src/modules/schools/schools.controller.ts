import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { SchoolsService } from "./schools.service";
import { CreateSchoolDto } from "./dto/create-school.dto";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("schools")
@UseGuards(JwtGuard, RolesGuard)
@Roles("admin")
export class SchoolsController {
  constructor(private readonly schools: SchoolsService) {}

  @Get()
  list() {
    return this.schools.list();
  }

  @Post()
  create(@Body() dto: CreateSchoolDto) {
    return this.schools.createOrGet(dto);
  }
}
