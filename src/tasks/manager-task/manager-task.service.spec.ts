import { Test, TestingModule } from '@nestjs/testing';
import { ManagerTaskService } from './manager-task.service';

describe('ManagerTaskService', () => {
  let service: ManagerTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManagerTaskService],
    }).compile();

    service = module.get<ManagerTaskService>(ManagerTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
