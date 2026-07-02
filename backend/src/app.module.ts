import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AdminModule } from "./modules/admin/admin.module";
import { SchoolsModule } from "./modules/schools/schools.module";
import { ParticipantsModule } from "./modules/participants/participants.module";
import { HealthModule } from "./modules/health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    DatabaseModule,
    AuthModule,
    AdminModule,
    SchoolsModule,
    ParticipantsModule,
    HealthModule,
  ],
})
export class AppModule {}
