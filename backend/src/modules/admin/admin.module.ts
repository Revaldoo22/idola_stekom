import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { School, Participant, Profile, DailyVote } from "../../database/entities";
import { AuthModule } from "../auth/auth.module";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([School, Participant, Profile, DailyVote]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
