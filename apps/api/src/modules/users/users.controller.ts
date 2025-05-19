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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from './schemas/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define a type for the Multer file
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

// Define a type for the multer callbacks
type FileNameCallback = (error: null, filename: string) => void;

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
  constructor(private readonly usersService: UsersService) {}

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
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb: FileNameCallback) => {
          const uniqueFilename = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueFilename);
        },
      }),
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

    // Build the URL to the uploaded file
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3003/api/v1';
    const avatarUrl = `${baseUrl}/uploads/avatars/${file.filename}`;

    // Update the user's avatarUrl field using the ID from the JWT token
    await this.usersService.update(req.user.id, { avatarUrl });

    return { avatarUrl };
  }

  @Post(':id/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb: FileNameCallback) => {
          const uniqueFilename = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueFilename);
        },
      }),
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

    // Build the URL to the uploaded file
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3003/api/v1';
    const avatarUrl = `${baseUrl}/uploads/avatars/${file.filename}`;

    // Update the user's avatarUrl field
    await this.usersService.update(id, { avatarUrl });

    return { avatarUrl };
  }
}
