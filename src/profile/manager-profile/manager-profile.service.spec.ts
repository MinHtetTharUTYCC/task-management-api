import { Test, TestingModule } from '@nestjs/testing';
import { ManagerProfileService } from './manager-profile.service';

describe('ManagerProfileService', () => {
  let service: ManagerProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManagerProfileService],
    }).compile();

    service = module.get<ManagerProfileService>(ManagerProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
