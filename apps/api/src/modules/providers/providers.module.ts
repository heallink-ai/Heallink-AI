import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { Provider, ProviderSchema } from './schemas/provider.schema';
import { Specialization, SpecializationSchema } from './schemas/specialization.schema';
import { Practice, PracticeSchema } from './schemas/practice.schema';
import { KnowledgeBase, KnowledgeBaseSchema } from './schemas/knowledge-base.schema';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../emails/email.module';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Provider.name, schema: ProviderSchema },
      { name: Specialization.name, schema: SpecializationSchema },
      { name: Practice.name, schema: PracticeSchema },
      { name: KnowledgeBase.name, schema: KnowledgeBaseSchema },
    ]),
    UsersModule,
    EmailModule,
    LoggingModule,
  ],
  controllers: [ProvidersController],
  providers: [ProvidersService],
  exports: [ProvidersService, MongooseModule],
})
export class ProvidersModule {}