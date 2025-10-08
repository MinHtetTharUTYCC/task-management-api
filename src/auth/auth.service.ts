import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt"
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class AuthService {

    constructor(private readonly databaseService: DatabaseService, private readonly jwtService: JwtService) { }

    async getAllUsers() {
        return this.databaseService.user.findMany();
    }

    async register(registerDto: RegisterDto) {
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

    async login(loginDto: LoginDto) {
        const existingUser = await this.databaseService.user.findUnique({
            where: {
                email: loginDto.email,
            }
        })
        if (!existingUser) throw new BadRequestException("User Not Found");

        const isPwdValid = await bcrypt.compare(loginDto.password, existingUser.password);
        if (!isPwdValid) {
            throw new BadRequestException("Incorrect Password");
        }
        const payload = { sub: existingUser.id, email: existingUser.email }

        return { access_token: await this.jwtService.signAsync(payload) }
    }

}
