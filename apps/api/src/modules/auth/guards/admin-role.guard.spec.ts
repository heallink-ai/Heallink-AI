import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRoleGuard } from './admin-role.guard';
import { LoggingService } from '../../logging/logging.service';
import { AdminRole } from '../../users/entities/admin-user.entity';

describe('AdminRoleGuard', () => {
  let guard: AdminRoleGuard;
  let reflector: Reflector;

  const mockLoggingService = {
    setContext: jest.fn(),
    warn: jest.fn(),
    logAuth: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminRoleGuard,
        Reflector,
        {
          provide: LoggingService,
          useValue: mockLoggingService,
        },
      ],
    }).compile();

    guard = module.get<AdminRoleGuard>(AdminRoleGuard);
    reflector = module.get<Reflector>(Reflector);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if no roles are specified', () => {
      const context = createMockExecutionContext();

      jest.spyOn(reflector, 'get').mockReturnValue([]);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should return true if user has required role', () => {
      const context = createMockExecutionContext({
        user: {
          sub: 'user-id',
          adminRole: AdminRole.SUPER_ADMIN,
        },
      });

      jest.spyOn(reflector, 'get').mockReturnValue([AdminRole.SUPER_ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockLoggingService.logAuth).toHaveBeenCalledWith(
        'user-id',
        'role-guard',
        true,
        { adminRole: AdminRole.SUPER_ADMIN },
      );
    });

    it('should throw ForbiddenException if user has no admin role', () => {
      const context = createMockExecutionContext({
        user: {
          sub: 'user-id',
          // no adminRole
        },
      });

      jest.spyOn(reflector, 'get').mockReturnValue([AdminRole.SUPER_ADMIN]);

      expect(() => {
        guard.canActivate(context);
      }).toThrow(ForbiddenException);

      expect(mockLoggingService.logAuth).toHaveBeenCalledWith(
        'user-id',
        'role-guard',
        false,
        {
          requiredRoles: [AdminRole.SUPER_ADMIN],
          userRole: 'none',
        },
      );
    });

    it('should throw ForbiddenException if user has insufficient role', () => {
      const context = createMockExecutionContext({
        user: {
          sub: 'user-id',
          adminRole: AdminRole.READONLY_ADMIN,
        },
      });

      jest.spyOn(reflector, 'get').mockReturnValue([AdminRole.SUPER_ADMIN]);

      expect(() => {
        guard.canActivate(context);
      }).toThrow(ForbiddenException);

      expect(mockLoggingService.logAuth).toHaveBeenCalledWith(
        'user-id',
        'role-guard',
        false,
        {
          requiredRoles: [AdminRole.SUPER_ADMIN],
          userRole: AdminRole.READONLY_ADMIN,
        },
      );
    });

    it('should return false if no user is found in request', () => {
      const context = createMockExecutionContext({
        // no user
      });

      jest.spyOn(reflector, 'get').mockReturnValue([AdminRole.SUPER_ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
      expect(mockLoggingService.warn).toHaveBeenCalled();
    });
  });
});

function createMockExecutionContext(request = {}): ExecutionContext {
  const mockExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as ExecutionContext;

  return mockExecutionContext;
}
