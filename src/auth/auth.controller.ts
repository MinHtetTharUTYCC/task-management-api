import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';

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
    login(@Body(ValidationPipe) loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }

    // testing purpose
    @Get('users')
    getAllUsers() {
        return this.authService.getAllUsers()
    }

}
