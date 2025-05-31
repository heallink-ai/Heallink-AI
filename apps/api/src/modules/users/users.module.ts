import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { AdminUser, AdminUserSchema } from './entities/admin-user.entity';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';
import { AuditLogService } from './services/audit-log.service';
import { AwsModule } from '../aws';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AdminUser.name, schema: AdminUserSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
    AwsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, AuditLogService],
  exports: [UsersService, AuditLogService, MongooseModule],
})
export class UsersModule {}
