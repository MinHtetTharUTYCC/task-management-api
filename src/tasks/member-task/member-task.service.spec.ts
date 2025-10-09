import { Test, TestingModule } from '@nestjs/testing';
import { MemberTaskService } from './member-task.service';

describe('MemberTaskService', () => {
  let service: MemberTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberTaskService],
    }).compile();

    service = module.get<MemberTaskService>(MemberTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
