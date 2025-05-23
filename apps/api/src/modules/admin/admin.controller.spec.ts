import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { S3Service } from '../aws/s3.service';
import { UserRole } from '../users/schemas/user.schema';
import { Types } from 'mongoose';

describe('AdminController', () => {
  let controller: AdminController;
  let adminService: AdminService;

  const mockAdminService = {
    createAdmin: jest.fn(),
    findAllAdmins: jest.fn(),
    findAdminById: jest.fn(),
    updateAdmin: jest.fn(),
    deleteAdmin: jest.fn(),
    getAdminStats: jest.fn(),
    toggleAdminStatus: jest.fn(),
  };

  const mockS3Service = {
    uploadFile: jest.fn(),
    getSignedUrl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    adminService = module.get<AdminService>(AdminService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAdmin', () => {
    it('should create a new admin', async () => {
      const createAdminDto = {
        email: 'admin@test.com',
        name: 'Test Admin',
        role: UserRole.ADMIN,
      };

      const expectedResult = {
        _id: new Types.ObjectId(),
        ...createAdminDto,
        emailVerified: true,
      };

      mockAdminService.createAdmin.mockResolvedValue(expectedResult);

      const result = await controller.createAdmin(createAdminDto);

      expect(adminService.createAdmin).toHaveBeenCalledWith(createAdminDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAllAdmins', () => {
    it('should return paginated admin list', async () => {
      const query = { page: 1, limit: 10 };
      const expectedResult = {
        admins: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockAdminService.findAllAdmins.mockResolvedValue(expectedResult);

      const result = await controller.findAllAdmins(query);

      expect(adminService.findAllAdmins).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAdminStats', () => {
    it('should return admin statistics', async () => {
      const expectedStats = {
        totalAdmins: 5,
        activeAdmins: 3,
        recentlyCreated: 2,
        roleDistribution: {
          [UserRole.ADMIN]: 3,
          [UserRole.PROVIDER]: 2,
        },
      };

      mockAdminService.getAdminStats.mockResolvedValue(expectedStats);

      const result = await controller.getAdminStats();

      expect(adminService.getAdminStats).toHaveBeenCalled();
      expect(result).toEqual(expectedStats);
    });
  });

  describe('findAdminById', () => {
    it('should return admin by id', async () => {
      const adminId = new Types.ObjectId().toString();
      const expectedAdmin = {
        _id: adminId,
        email: 'admin@test.com',
        name: 'Test Admin',
        role: UserRole.ADMIN,
      };

      mockAdminService.findAdminById.mockResolvedValue(expectedAdmin);

      const result = await controller.findAdminById(adminId);

      expect(adminService.findAdminById).toHaveBeenCalledWith(adminId);
      expect(result).toEqual(expectedAdmin);
    });
  });

  describe('updateAdmin', () => {
    it('should update admin', async () => {
      const adminId = new Types.ObjectId().toString();
      const updateDto = { name: 'Updated Name' };
      const expectedResult = {
        _id: adminId,
        email: 'admin@test.com',
        name: 'Updated Name',
        role: UserRole.ADMIN,
      };

      mockAdminService.updateAdmin.mockResolvedValue(expectedResult);

      const result = await controller.updateAdmin(adminId, updateDto);

      expect(adminService.updateAdmin).toHaveBeenCalledWith(adminId, updateDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteAdmin', () => {
    it('should delete admin', async () => {
      const adminId = new Types.ObjectId().toString();

      mockAdminService.deleteAdmin.mockResolvedValue(undefined);

      const result = await controller.deleteAdmin(adminId);

      expect(adminService.deleteAdmin).toHaveBeenCalledWith(adminId);
      expect(result).toEqual({ message: 'Admin deleted successfully' });
    });
  });

  describe('toggleAdminStatus', () => {
    it('should toggle admin status', async () => {
      const adminId = new Types.ObjectId().toString();
      const status = false;
      const expectedResult = {
        _id: adminId,
        email: 'admin@test.com',
        name: 'Test Admin',
        role: UserRole.ADMIN,
      };

      mockAdminService.toggleAdminStatus.mockResolvedValue(expectedResult);

      const result = await controller.toggleAdminStatus(adminId, status);

      expect(adminService.toggleAdminStatus).toHaveBeenCalledWith(
        adminId,
        status,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('bulkAction', () => {
    it('should perform bulk delete action', async () => {
      const adminIds = [
        new Types.ObjectId().toString(),
        new Types.ObjectId().toString(),
      ];
      const body = { action: 'delete' as const, adminIds };

      mockAdminService.deleteAdmin.mockResolvedValue(undefined);

      const result = await controller.bulkAction(body);

      expect(result).toEqual({
        message: 'Bulk delete completed',
        success: 2,
        failed: 0,
      });
    });

    it('should perform bulk status toggle action', async () => {
      const adminIds = [new Types.ObjectId().toString()];
      const body = { action: 'toggle-status' as const, adminIds, status: true };

      mockAdminService.toggleAdminStatus.mockResolvedValue({});

      const result = await controller.bulkAction(body);

      expect(result).toEqual({
        message: 'Bulk status update completed',
        success: 1,
        failed: 0,
      });
    });
  });

  it('should return auth info for test endpoint', async () => {
    const req = {
      user: { id: 'test-id', email: 'test@example.com', role: 'admin' },
      headers: { authorization: 'Bearer test-token' },
    };

    const result = await controller.testAuth(req);

    expect(result).toEqual({
      message: 'Authentication successful',
      user: req.user,
      headers: {
        authorization: 'Present',
      },
    });
  });
});
