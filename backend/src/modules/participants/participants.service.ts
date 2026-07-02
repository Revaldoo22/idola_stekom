import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Participant, School } from "../../database/entities";
import { SchoolsService } from "../schools/schools.service";
import {
  CreateParticipantDto,
  UpdateParticipantDto,
} from "./dto/participant.dto";

export interface ParticipantRow extends Participant {
  schoolName: string | null;
}

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private readonly participants: Repository<Participant>,
    private readonly schoolsService: SchoolsService,
  ) {}

  async list(): Promise<ParticipantRow[]> {
    const rows = await this.participants
      .createQueryBuilder("p")
      .leftJoin(School, "s", "s.id = p.school_id")
      .select("p")
      .addSelect("s.name", "school_name")
      .orderBy("p.total_points", "DESC")
      .getRawAndEntities();

    return rows.entities.map((p, i) => ({
      ...p,
      schoolName: rows.raw[i]?.school_name ?? null,
    }));
  }

  private async resolveSchoolId(
    dto: CreateParticipantDto | UpdateParticipantDto,
  ): Promise<string | null | undefined> {
    if (dto.schoolId) return dto.schoolId;
    if (dto.schoolName) {
      const school = await this.schoolsService.createOrGet({
        name: dto.schoolName,
      });
      return school.id;
    }
    return undefined; // not provided — leave unchanged on update
  }

  async create(dto: CreateParticipantDto) {
    if (!dto.schoolId && !dto.schoolName) {
      throw new BadRequestException("Pilih atau ketik nama sekolah");
    }
    const schoolId = await this.resolveSchoolId(dto);
    return this.participants.save(
      this.participants.create({
        name: dto.name.trim(),
        schoolId: schoolId ?? null,
        phoneNumber: dto.phoneNumber?.trim() || null,
        description: dto.description?.trim() || null,
      }),
    );
  }

  async update(id: string, dto: UpdateParticipantDto) {
    const participant = await this.participants.findOneBy({ id });
    if (!participant) throw new NotFoundException("Peserta tidak ditemukan");

    const schoolId = await this.resolveSchoolId(dto);
    if (schoolId !== undefined) participant.schoolId = schoolId;
    if (dto.name !== undefined) participant.name = dto.name.trim();
    if (dto.phoneNumber !== undefined)
      participant.phoneNumber = dto.phoneNumber.trim() || null;
    if (dto.description !== undefined)
      participant.description = dto.description.trim() || null;
    if (dto.status !== undefined) participant.status = dto.status;

    return this.participants.save(participant);
  }

  async remove(id: string) {
    const res = await this.participants.delete({ id });
    if (!res.affected) throw new NotFoundException("Peserta tidak ditemukan");
    return { ok: true };
  }
}
