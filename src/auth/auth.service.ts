import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

export interface SafeUser {
    id: string;
    email: string;
    role: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<SafeUser> {
        const user = await this.prisma.users.findUnique({where: {email}});

        if (!user) throw new UnauthorizedException('Credentials tidak valid');

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new UnauthorizedException('Credentials tidak valid');

        return {id: user.id, email: user.email, role: user.role};
    }

    async login(dto: LoginDto) {
        const user = await this.validateUser(dto.email, dto.password);
        const token = await this.jwt.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
        return {user, token};
    }
}