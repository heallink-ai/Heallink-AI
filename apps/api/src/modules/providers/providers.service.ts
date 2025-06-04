import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Provider, ProviderStatus } from './schemas/provider.schema';
import { Specialization } from './schemas/specialization.schema';
import { Practice } from './schemas/practice.schema';
import { KnowledgeBase } from './schemas/knowledge-base.schema';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/schemas/user.schema';
import { ProviderRegistrationDto } from './dto/provider-registration.dto';
import { EmailService } from '../emails/email.service';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectModel(Provider.name) private providerModel: Model<Provider>,
    @InjectModel(Specialization.name) private specializationModel: Model<Specialization>,
    @InjectModel(Practice.name) private practiceModel: Model<Practice>,
    @InjectModel(KnowledgeBase.name) private knowledgeBaseModel: Model<KnowledgeBase>,
    private usersService: UsersService,
    private emailService: EmailService,
  ) {}

  async registerProvider(userId: string, registrationDto: ProviderRegistrationDto): Promise<Provider> {
    // Check if user exists and has appropriate role
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.PROVIDER) {
      throw new BadRequestException('User must have provider role to register as provider');
    }

    // Check if provider already exists for this user
    const existingProvider = await this.providerModel.findOne({ userId });
    if (existingProvider) {
      throw new ConflictException('Provider profile already exists for this user');
    }

    // Check if license number is already registered
    const existingLicense = await this.providerModel.findOne({ 
      licenseNumber: registrationDto.licenseNumber,
      licenseState: registrationDto.licenseState 
    });
    if (existingLicense) {
      throw new ConflictException('License number already registered');
    }

    // Validate specializations
    if (registrationDto.specializations?.length) {
      const validSpecializations = await this.specializationModel.find({
        _id: { $in: registrationDto.specializations },
        isActive: true
      });
      
      if (validSpecializations.length !== registrationDto.specializations.length) {
        throw new BadRequestException('One or more specializations are invalid');
      }
    }

    // Create provider profile
    const provider = new this.providerModel({
      userId,
      ...registrationDto,
      status: ProviderStatus.PENDING,
    });

    const savedProvider = await provider.save();

    // Send verification email
    await this.emailService.sendProviderRegistrationNotification(user.email, {
      providerName: `${registrationDto.firstName} ${registrationDto.lastName}`,
      licenseNumber: registrationDto.licenseNumber,
    });

    return savedProvider;
  }

  async findProviderByUserId(userId: string): Promise<Provider | null> {
    return this.providerModel
      .findOne({ userId })
      .populate('specializations')
      .populate('primaryPractice')
      .populate('affiliatedPractices')
      .exec();
  }

  async updateProviderStatus(providerId: string, status: ProviderStatus, verifiedBy?: string): Promise<Provider> {
    const updateData: any = { status };
    
    if (status === ProviderStatus.VERIFIED) {
      updateData.verifiedAt = new Date();
      if (verifiedBy) {
        updateData.verifiedBy = verifiedBy;
      }
    }

    const provider = await this.providerModel
      .findByIdAndUpdate(providerId, updateData, { new: true })
      .populate('userId')
      .exec();

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    return provider;
  }

  async getAllSpecializations(): Promise<Specialization[]> {
    return this.specializationModel.find({ isActive: true }).sort({ name: 1 }).exec();
  }

  async createSpecialization(name: string, code: string, description?: string): Promise<Specialization> {
    const specialization = new this.specializationModel({
      name,
      code,
      description,
    });
    return specialization.save();
  }
}