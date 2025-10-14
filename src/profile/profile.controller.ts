import { Body, Controller, Get, Param, Patch, ValidationPipe } from '@nestjs/common';
import { ReqUser } from 'src/auth/req-user.decorator';
import type { RequestUser } from 'src/auth/request-user.interface';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Auth } from 'src/auth/auth.decorator';

@Controller('profile')
export class ProfileController {

    constructor(private readonly profileService: ProfileService) { }

    @Auth()
    @Get('me')
    myProfile(@ReqUser() user: RequestUser) {
        return this.profileService.getMyProfile(user);
    }

    @Auth()
    @Get(':id')
    visitProfile(@Param('id') id: string, @ReqUser() user: RequestUser) {
        return this.profileService.visitProfile(id, user)
    }

    @Auth()
    @Patch('me')
    updateMyProfile(@Body(ValidationPipe) updateProfileDto: UpdateProfileDto, @ReqUser() user: RequestUser) {
        return this.profileService.updateMyProfile(user.sub, updateProfileDto)
    }

}
