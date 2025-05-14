import { Test, TestingModule } from '@nestjs/testing';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { PassportModule } from '@nestjs/passport';

describe('JwtRefreshGuard', () => {
  let guard: JwtRefreshGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt-refresh' })],
      providers: [JwtRefreshGuard],
    }).compile();

    guard = module.get<JwtRefreshGuard>(JwtRefreshGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
