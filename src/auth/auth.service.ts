import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt"
import { DatabaseService } from 'src/database/database.service';
import { Response } from 'express';


@Injectable()
export class AuthService {

    constructor(private readonly databaseService: DatabaseService, private readonly jwtService: JwtService) { }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.databaseService.user.findUnique({
            where: { email: registerDto.email }
        })
        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        const { password, ...signUpDto } = registerDto;
        const hashed = await bcrypt.hash(password, 10)

        const newUser = await this.databaseService.user.create({
            data: {
                password: hashed,
                ...signUpDto,
            },
            select: {
                username: true,
                email: true,
            }
        })

        return {
            message: "Successfully registered",
            userData: {
                username: newUser.username,
                email: newUser.email,
            }
        };
    }

    async login(loginDto: LoginDto, res?: Response) {
        const existingUser = await this.databaseService.user.findUnique({
            where: {
                email: loginDto.email,
            },
            select: {
                id: true,
                email: true,
                username: true,
                password: true,
                role: true,
            }
        })
        if (!existingUser) throw new BadRequestException("Invalid credentials");

        const isPwdValid = await bcrypt.compare(loginDto.password, existingUser.password);
        if (!isPwdValid) {
            throw new BadRequestException("Invalid credentials");
        }
        const payload = {
            sub: existingUser.id,
            email: existingUser.email,
            username: existingUser.username,
            role: existingUser.role
        };

        const token = await this.jwtService.signAsync(payload);

        if (res) {
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 10 * 60 * 60 * 1000,//10 hours
            });
        }

        return {
            access_token: token,
            user: {
                id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email,
                role: existingUser.role,
            }
        }
    }

}
