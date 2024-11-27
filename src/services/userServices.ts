import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../constants";

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async createUser({ firstName, lastName, email, password }: UserData) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });

        if (user) {
            const error = createHttpError(400, "Email  already Exists!");

            throw error;
        }
        try {
            const newUser = this.userRepository.create({
                firstName,
                lastName,
                email,
                password,
                role: Roles.CUSTOMER,
            });

            return await this.userRepository.save(newUser);
        } catch (err) {
            const error = createHttpError(
                500,
                "Failed o store the data in the database",
            );
            throw error;
        }
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email } });
    }
}
