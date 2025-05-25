import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { LivekitService } from './livekit.service';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';

jest.mock('livekit-server-sdk', () => {
  return {
    AccessToken: jest.fn().mockImplementation(() => ({
      identity: '',
      addGrant: jest.fn().mockReturnThis(),
      toJwt: jest.fn().mockResolvedValue('mock-jwt-token'),
    })),
    RoomServiceClient: jest.fn().mockImplementation(() => ({
      createRoom: jest.fn().mockResolvedValue({ name: 'test-room' }),
      listRooms: jest.fn().mockResolvedValue([{ name: 'test-room' }]),
      deleteRoom: jest.fn().mockResolvedValue(undefined),
    })),
  };
});

describe('LivekitService', () => {
  let service: LivekitService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LivekitService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'LIVEKIT_URL':
                  return 'wss://livekit.test';
                case 'LIVEKIT_API_KEY':
                  return 'test-api-key';
                case 'LIVEKIT_API_SECRET':
                  return 'test-api-secret';
                default:
                  return undefined;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<LivekitService>(LivekitService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createToken', () => {
    it('should generate a token', async () => {
      const dto = {
        roomName: 'test-room',
        identity: 'test-user',
      };

      const token = await service.createToken(dto);
      expect(token).toBe('mock-jwt-token');
      expect(AccessToken).toHaveBeenCalledWith('test-api-key', 'test-api-secret', {
        identity: 'test-user',
        ttl: '1h',
      });
    });
  });

  describe('createRoom', () => {
    it('should create a room', async () => {
      const dto = {
        name: 'test-room',
        emptyTimeout: 10,
        maxParticipants: 2,
      };

      const room = await service.createRoom(dto);
      expect(room).toEqual({ name: 'test-room' });
    });
  });

  describe('listRooms', () => {
    it('should list rooms', async () => {
      const rooms = await service.listRooms();
      expect(rooms).toEqual([{ name: 'test-room' }]);
    });
  });

  describe('deleteRoom', () => {
    it('should delete a room', async () => {
      await expect(service.deleteRoom('test-room')).resolves.not.toThrow();
    });
  });
});