import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { RegistrationUserRequest, UserData } from "../types";
import { UserService } from "../services/userServices";
import { Logger } from "winston";
import bcrypt from "bcrypt";
import { send } from "process";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { JwtPayload, sign } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Config } from "../config";
import { RefreshToken } from "../entity/RefreshToken";
import { TokenService } from "../services/tokenServices";
export class AuthControllers {
    constructor(
        private userServices: UserService,
        private logger: Logger,
        private tokenService: TokenService,
    ) {}
    async register(
        req: RegistrationUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            // Validation
            const validator = validationResult(req);
            if (!validator.isEmpty()) {
                return res.status(400).json({ errors: validator.array() });
            }
            const { firstName, lastName, email, password } =
                req.body as UserData;

            //Hash the password
            const saltRound = 10;
            const hashedPassword = await bcrypt.hash(password, saltRound);

            const result = await this.userServices.createUser({
                firstName,
                lastName,
                email,
                password: hashedPassword,
            });

            const payload: JwtPayload = {
                sub: result.id.toString(),
                role: result.role,
            };

            const newRefrreshToken =
                await this.tokenService.persistRefreshToken(result);

            const accessToken = this.tokenService.generateTokens(payload);
            const refreshToken = this.tokenService.generateRefreshToken(
                { ...payload },
                String(newRefrreshToken.id),
            );

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, // one hours
                httpOnly: true,
            });
            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, // one years
                httpOnly: true,
            });

            this.logger.info("User has been reqgistered", { id: result.id });
            res.status(201).json({ id: result.id });
        } catch (err) {
            next(err);
            return;
        }
    }
}
