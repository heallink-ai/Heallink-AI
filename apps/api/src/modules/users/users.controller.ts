import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  BadRequestException,
  UnsupportedMediaTypeException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from './schemas/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { S3Service } from '../aws/s3.service';
import { memoryStorage } from 'multer';

// Define a type for the Multer file
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

// Define a type for the authenticated request
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email?: string;
    role: UserRole;
  };
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: AuthenticatedRequest) {
    // req.user is set by JwtStrategy.validate
    return this.usersService.findOne(req.user.id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('profile/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(), // Use memory storage to get file buffer
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async uploadProfileAvatar(
    @Request() req: AuthenticatedRequest,
    @UploadedFile() file: MulterFile,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate the file is an image
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      throw new UnsupportedMediaTypeException('Only image files are allowed');
    }

    try {
      // Generate a unique filename
      const fileExtension = extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const s3Key = `avatars/${req.user.id}/${fileName}`;

      // Upload to S3
      await this.s3Service.uploadFile(s3Key, file.buffer, file.mimetype);

      // Generate a pre-signed URL for the avatar (valid for 24 hours)
      const avatarUrl = await this.s3Service.getSignedUrl(s3Key, 86400);

      // Update the user's avatarUrl field
      await this.usersService.update(req.user.id, { avatarUrl: s3Key });

      return { avatarUrl };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload avatar';
      throw new InternalServerErrorException(
        `Failed to upload avatar: ${errorMessage}`,
      );
    }
  }

  @Post(':id/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(), // Use memory storage to get file buffer
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: MulterFile,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate the file is an image
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      throw new UnsupportedMediaTypeException('Only image files are allowed');
    }

    try {
      // Generate a unique filename
      const fileExtension = extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const s3Key = `avatars/${id}/${fileName}`;

      // Upload to S3
      await this.s3Service.uploadFile(s3Key, file.buffer, file.mimetype);

      // Generate a pre-signed URL for the avatar (valid for 24 hours)
      const avatarUrl = await this.s3Service.getSignedUrl(s3Key, 86400);

      // Update the user's avatarUrl field
      await this.usersService.update(id, { avatarUrl: s3Key });

      return { avatarUrl };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload avatar';
      throw new InternalServerErrorException(
        `Failed to upload avatar: ${errorMessage}`,
      );
    }
  }
}
