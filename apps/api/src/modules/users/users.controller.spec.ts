import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

// Mock UsersService
const mockUser = {
  _id: 'user123',
  email: 'test@example.com',
  name: 'Test User',
};

const mockUsersService = {
  findOne: jest.fn().mockResolvedValue(mockUser),
  update: jest.fn().mockResolvedValue({ ...mockUser, name: 'Updated Name' }),
};

// Mock Auth Guard to always allow
// Mock Auth Guard to always allow
const MockJwtAuthGuard = {
  canActivate: () => true,
};

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtAuthGuard, useValue: MockJwtAuthGuard },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return the current user profile', async () => {
      const req = { user: { id: 'user123' } };
      const result = await controller.getProfile(req);
      expect(usersService.findOne).toHaveBeenCalledWith('user123');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateProfile', () => {
    it('should update and return the user profile', async () => {
      const req = { user: { id: 'user123' } };
      const dto: UpdateUserDto = { name: 'Updated Name' };
      const result = await controller.updateProfile(req, dto);
      expect(usersService.update).toHaveBeenCalledWith('user123', dto);
      expect(result).toEqual({ ...mockUser, name: 'Updated Name' });
    });
  });
});
