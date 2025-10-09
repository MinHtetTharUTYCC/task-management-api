import { Test, TestingModule } from '@nestjs/testing';
import { MemberProjectService } from './member-project.service';

describe('MemberProjectService', () => {
  let service: MemberProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberProjectService],
    }).compile();

    service = module.get<MemberProjectService>(MemberProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
