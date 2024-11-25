import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../constants";

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async createUser({ firstName, lastName, email, password }: UserData) {
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
}
