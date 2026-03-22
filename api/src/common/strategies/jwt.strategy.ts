import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

export interface JwtPayload {
  sub: string;
  username: string;
  isAdmin: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("jwtSecret"),
    });
  }

  async validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      username: payload.username,
      isAdmin: payload.isAdmin,
    };
  }
}
