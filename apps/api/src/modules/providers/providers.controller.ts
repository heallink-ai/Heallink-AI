import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ProvidersService } from './providers.service';
import { ProviderRegistrationDto } from './dto/provider-registration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, ProviderStatus } from '../users/schemas/user.schema';

@ApiTags('providers')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register as a healthcare provider' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Provider registered successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid registration data' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Provider already exists or license already registered' })
  async registerProvider(
    @Request() req: any,
    @Body() registrationDto: ProviderRegistrationDto,
  ) {
    return this.providersService.registerProvider(req.user.id, registrationDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get provider profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Provider profile retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Provider profile not found' })
  async getProviderProfile(@Request() req: any) {
    return this.providersService.findProviderByUserId(req.user.id);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update provider status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Provider ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Provider status updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Provider not found' })
  async updateProviderStatus(
    @Param('id') providerId: string,
    @Body() statusDto: { status: ProviderStatus },
    @Request() req: any,
  ) {
    return this.providersService.updateProviderStatus(
      providerId,
      statusDto.status,
      req.user.id,
    );
  }

  @Get('specializations')
  @ApiOperation({ summary: 'Get all medical specializations' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Specializations retrieved successfully' })
  async getSpecializations() {
    return this.providersService.getAllSpecializations();
  }

  @Post('specializations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new specialization (Admin only)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Specialization created successfully' })
  async createSpecialization(
    @Body() specializationDto: { name: string; code: string; description?: string },
  ) {
    return this.providersService.createSpecialization(
      specializationDto.name,
      specializationDto.code,
      specializationDto.description,
    );
  }
}