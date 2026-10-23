import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwTPayload } from "../interfaces/jwt-payload.interfaces";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwTStrategy extends PassportStrategy(Strategy) {


    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET') as string,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate (payload: JwTPayload): Promise<User>{
        const {email} = payload

        const user = await this.userRepository.findOneBy({email})

        if(!user)
            throw new UnauthorizedException('Token no valido')

        if(!user.isActive)
            throw new UnauthorizedException('Usuario inactivo')

        return user;
    }
}