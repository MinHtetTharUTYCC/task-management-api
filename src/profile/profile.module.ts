import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AdminProfileService } from './admin-profile/admin-profile.service';
import { ManagerProfileService } from './manager-profile/manager-profile.service';
import { MemberProfileService } from './member-profile/member-profile.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, AdminProfileService, ManagerProfileService, MemberProfileService]
})
export class ProfileModule {}
