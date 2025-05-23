import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  phoneVerified?: boolean;
}
