import express from "express";
import { AuthControllers } from "../controllers/AuthControllers";
import { UserService } from "../services/userServices";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";

const router = express.Router();
const userReposistory = AppDataSource.getRepository(User);

const userSerices = new UserService(userReposistory);
const authControllers = new AuthControllers(userSerices, logger);

router.post("/register", (req, res, next) =>
    authControllers.register(req, res, next),
);

export default router;
