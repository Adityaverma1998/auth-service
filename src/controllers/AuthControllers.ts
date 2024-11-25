import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { RegistrationUserRequest } from "../types";
import { UserService } from "../services/userServices";
import { Logger } from "winston";

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
            const { firstName, lastName, email, password } = req.body;
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
                password,
            });
            this.logger.info("User has been reqgistered", { id: result.id });
            res.status(201).json({ id: result.id });
        } catch (err) {
            next(err);
            return;
        }
    }
}
