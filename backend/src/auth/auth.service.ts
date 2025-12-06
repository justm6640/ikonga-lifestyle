import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && (await bcrypt.compare(pass, user.passwordHash))) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(signupDto: SignupDto) {
        const {
            email, password, firstName, lastName,
            sexe, paysOrigine, paysResidence, villeResidence,
            dateNaissance, contact, tailleCm
        } = signupDto;

        const existingUser = await this.usersService.findOne(email);
        if (existingUser) {
            throw new UnauthorizedException('User already exists');
        }

        const user = await this.usersService.create({
            email,
            passwordHash: password, // UsersService will hash it
            firstName,
            lastName,
            sexe,
            paysOrigine,
            paysResidence,
            villeResidence,
            dateNaissance: dateNaissance ? new Date(dateNaissance) : undefined,
            contact,
            tailleCm,
        });
        return this.login(user);
    }
}
