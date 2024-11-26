import createHttpError from "http-errors";
import { JwtPayload, sign } from "jsonwebtoken";
import path from "path";
import { AppDataSource } from "../config/data-source";
import fs from "fs";
import { TokenPayload } from "../types";
import { Config } from "../config";
import { RefreshToken } from "../entity/RefreshToken";

export class TokenService {
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
}
