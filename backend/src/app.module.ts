import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AdminModule } from "./modules/admin/admin.module";
import { SchoolsModule } from "./modules/schools/schools.module";
import { ParticipantsModule } from "./modules/participants/participants.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { VotingModule } from "./modules/voting/voting.module";
import { PublicModule } from "./modules/public/public.module";
import { QuestsModule } from "./modules/quests/quests.module";
import { SubmissionsAdminModule } from "./modules/submissions-admin/submissions-admin.module";
import { ParticipantSelfModule } from "./modules/participant-self/participant-self.module";
import { UploadsModule } from "./modules/uploads/uploads.module";
import { HealthModule } from "./modules/health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    DatabaseModule,
    AuthModule,
    AdminModule,
    SchoolsModule,
    ParticipantsModule,
    SettingsModule,
    VotingModule,
    PublicModule,
    QuestsModule,
    SubmissionsAdminModule,
    ParticipantSelfModule,
    UploadsModule,
    HealthModule,
  ],
})
export class AppModule {}
