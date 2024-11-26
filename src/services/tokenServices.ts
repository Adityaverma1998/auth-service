import createHttpError from "http-errors";
import { JwtPayload, sign } from "jsonwebtoken";
import path from "path";
import { AppDataSource } from "../config/data-source";
import fs from "fs";
import { TokenPayload } from "../types";
import { Config } from "../config";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
import { Repository } from "typeorm";

export class TokenService {
    constructor(private refreshTokenRepo: Repository<RefreshToken>) {}

    generateTokens(payload: JwtPayload) {
        let privateKey: Buffer;
        try {
            privateKey = fs.readFileSync(
                path.join(__dirname, "../../certs/private.pem"),
            );
        } catch (err) {
            const error = createHttpError(
                500,
                "Error while reading rivate key",
            );
            throw error;
        }

        let accessToken = sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "1h",
            issuer: "auth-service",
        });
        return accessToken;
    }
    generateRefreshToken(payload: JwtPayload, id: string) {
        //persist the refresh token

        let refreshToken = sign(payload, Config.REFERSH_TOKEN_SECRET!, {
            algorithm: "HS256",
            expiresIn: "1y",
            issuer: "auth-service",
            jwtid: id,
        });

        return refreshToken;
    }

    async persistRefreshToken(user: User) {
        const MS_IN_YEARS = 100 * 60 * 60 * 24 * 365;
        const newRefrreshToken = await this.refreshTokenRepo.save({
            user: user,
            expiresAt: new Date(Date.now() + MS_IN_YEARS),
        });

        return newRefrreshToken;
    }
}
