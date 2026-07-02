import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { School } from "../../database/entities";
import { CreateSchoolDto } from "./dto/create-school.dto";

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School) private readonly schools: Repository<School>,
  ) {}

  list() {
    return this.schools.find({ order: { name: "ASC" } });
  }

  /** Case-insensitive find-or-create so duplicate names never pile up. */
  async createOrGet(dto: CreateSchoolDto) {
    const name = dto.name.trim();
    const existing = await this.schools
      .createQueryBuilder("s")
      .where("LOWER(s.name) = LOWER(:name)", { name })
      .getOne();
    if (existing) return existing;
    return this.schools.save(this.schools.create({ name }));
  }
}
