import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EmailModule } from "./modules/emails/email.module";
import emailConfig from "./modules/emails/email.config";
import appConfig, {
  validationSchema as configValidationSchema,
} from "./config/configuration";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, emailConfig],
      validationSchema: configValidationSchema,
    }),
    EmailModule,
  ],
})
export class AppModule {}
