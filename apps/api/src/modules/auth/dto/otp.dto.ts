import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class SendOtpDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;
}

export class VerifyOtpDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;
}