import { Test, TestingModule } from '@nestjs/testing';
import { PowerpointController } from './powerpoint.controller';
import { PowerpointService } from './powerpoint.service';

describe('PowerpointController', () => {
  let controller: PowerpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PowerpointController],
      providers: [PowerpointService],
    }).compile();

    controller = module.get<PowerpointController>(PowerpointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
