import { Request } from "express";

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface RegistrationUserRequest extends Request {
    body: UserData;
}
