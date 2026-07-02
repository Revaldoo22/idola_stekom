import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  DailyVote,
  Participant,
  ParticipantContent,
  Profile,
  Quest,
  Submission,
  SubmissionProof,
} from "../../database/entities";
import { SettingsModule } from "../settings/settings.module";
import { AntiCheatService } from "./anti-cheat.service";
import { VotesService } from "./votes.service";
import { SubmissionsService } from "./submissions.service";
import { VotingController } from "./voting.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DailyVote,
      Participant,
      Profile,
      Quest,
      Submission,
      SubmissionProof,
      ParticipantContent,
    ]),
    SettingsModule,
  ],
  controllers: [VotingController],
  providers: [AntiCheatService, VotesService, SubmissionsService],
  exports: [AntiCheatService],
})
export class VotingModule {}
