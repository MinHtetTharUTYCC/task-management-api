import { Test, TestingModule } from '@nestjs/testing';
import { DueDateNotificationsService } from './due-date-notifications.service';

describe('DueDateNotificationsService', () => {
  let service: DueDateNotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DueDateNotificationsService],
    }).compile();

    service = module.get<DueDateNotificationsService>(DueDateNotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
