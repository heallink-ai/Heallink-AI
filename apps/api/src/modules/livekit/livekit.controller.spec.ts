import { Test, TestingModule } from '@nestjs/testing';
import { LivekitController } from './livekit.controller';
import { LivekitService } from './livekit.service';

describe('LivekitController', () => {
  let controller: LivekitController;
  let service: LivekitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LivekitController],
      providers: [
        {
          provide: LivekitService,
          useValue: {
            createToken: jest.fn().mockResolvedValue('mock-token'),
            createRoom: jest.fn().mockResolvedValue({ name: 'test-room' }),
            listRooms: jest.fn().mockResolvedValue([{ name: 'test-room' }]),
            deleteRoom: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<LivekitController>(LivekitController);
    service = module.get<LivekitService>(LivekitService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createToken', () => {
    it('should create a token', async () => {
      const dto = {
        roomName: 'test-room',
        identity: 'test-user',
      };
      
      expect(await controller.createToken(dto)).toEqual({ token: 'mock-token' });
      expect(service.createToken).toHaveBeenCalledWith(dto);
    });
  });

  describe('createRoom', () => {
    it('should create a room', async () => {
      const dto = {
        name: 'test-room',
      };
      
      expect(await controller.createRoom(dto)).toEqual({ name: 'test-room' });
      expect(service.createRoom).toHaveBeenCalledWith(dto);
    });
  });

  describe('listRooms', () => {
    it('should list rooms', async () => {
      expect(await controller.listRooms()).toEqual([{ name: 'test-room' }]);
      expect(service.listRooms).toHaveBeenCalled();
    });
  });

  describe('deleteRoom', () => {
    it('should delete a room', async () => {
      expect(await controller.deleteRoom('test-room')).toEqual({ success: true });
      expect(service.deleteRoom).toHaveBeenCalledWith('test-room');
    });
  });
});