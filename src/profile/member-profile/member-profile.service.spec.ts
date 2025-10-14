import { Test, TestingModule } from '@nestjs/testing';
import { MemberProfileService } from './member-profile.service';

describe('MemberProfileService', () => {
  let service: MemberProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberProfileService],
    }).compile();

    service = module.get<MemberProfileService>(MemberProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
