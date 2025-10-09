import { Test, TestingModule } from '@nestjs/testing';
import { ManagerProjectService } from './manager-project.service';

describe('ManagerProjectService', () => {
  let service: ManagerProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManagerProjectService],
    }).compile();

    service = module.get<ManagerProjectService>(ManagerProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
