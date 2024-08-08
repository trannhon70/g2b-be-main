import { Test, TestingModule } from '@nestjs/testing';
import { PowerpointService } from './powerpoint.service';

describe('PowerpointService', () => {
  let service: PowerpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PowerpointService],
    }).compile();

    service = module.get<PowerpointService>(PowerpointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
