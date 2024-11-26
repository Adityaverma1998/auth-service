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
export class AuthControllers {
    constructor(
        private userServices: UserService,
        private logger: Logger,
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

            this.logger.debug("New request to the registerd user ", {
                firstName,
                lastName,
                email,
                password: "*********",
            });

            const result = await this.userServices.createUser({
                firstName,
                lastName,
                email,
                password: hashedPassword,
            });
            this.logger.info("User has been reqgistered", { id: result.id });
            res.status(201).json({ id: result.id });
        } catch (err) {
            next(err);
            return;
        }
    }
}
