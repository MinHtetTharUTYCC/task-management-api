import { Test, TestingModule } from '@nestjs/testing';
import { AdminTaskService } from './admin-task.service';

describe('AdminTaskService', () => {
  let service: AdminTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminTaskService],
    }).compile();

    service = module.get<AdminTaskService>(AdminTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
