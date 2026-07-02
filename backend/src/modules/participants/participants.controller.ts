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
import { ParticipantsService } from "./participants.service";
import {
  CreateParticipantDto,
  UpdateParticipantDto,
} from "./dto/participant.dto";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("participants")
@UseGuards(JwtGuard, RolesGuard)
@Roles("admin")
export class ParticipantsController {
  constructor(private readonly participants: ParticipantsService) {}

  @Get()
  list() {
    return this.participants.list();
  }

  @Post()
  create(@Body() dto: CreateParticipantDto) {
    return this.participants.create(dto);
  }

  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateParticipantDto,
  ) {
    return this.participants.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.participants.remove(id);
  }
}
