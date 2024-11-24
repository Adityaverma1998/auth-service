import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { UserData } from "../types";

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async createUser({ firstName, lastName, email, password }: UserData) {
        const newUser = this.userRepository.create({
            firstName,
            lastName,
            email,
            password,
        });

        return await this.userRepository.save(newUser);
    }
}
