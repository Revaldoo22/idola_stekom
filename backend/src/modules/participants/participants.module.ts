import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Participant, Profile } from "../../database/entities";
import { AuthModule } from "../auth/auth.module";
import { SchoolsModule } from "../schools/schools.module";
import { ParticipantsService } from "./participants.service";
import { ParticipantsController } from "./participants.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Participant, Profile]),
    AuthModule,
    SchoolsModule,
  ],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
})
export class ParticipantsModule {}
