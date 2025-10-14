import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
import { Auth } from './auth.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    register(@Body(ValidationPipe) registerDto: RegisterDto) {
        return this.authService.register(registerDto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(
        @Body(ValidationPipe) loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.login(loginDto, res)
    }

    @Auth()
    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('jwt', { path: '/' })
        return { message: "Logged out successfully" }
    }

    @Auth()
    @Get('me')
    getMe(@Req() req) {
        return req.user;
    }

}
