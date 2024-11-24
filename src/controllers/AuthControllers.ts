import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { RegistrationUserRequest } from "../types";
import { UserService } from "../services/userServices";

export class AuthControllers {
    constructor(private userServices: UserService) {}
    async register(req: RegistrationUserRequest, res: Response) {
        const { firstName, lastName, email, password } = req.body;
        const result = await this.userServices.createUser({
            firstName,
            lastName,
            email,
            password,
        });

        res.status(201).json({ id: result.id });
    }
}
