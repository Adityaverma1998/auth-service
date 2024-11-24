import express from "express";
import { AuthControllers } from "../controllers/AuthControllers";
import { UserService } from "../services/userServices";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";

const router = express.Router();
const userReposistory = AppDataSource.getRepository(User);

const userSerices = new UserService(userReposistory);
const authControllers = new AuthControllers(userSerices);

router.post("/register", (req, res) => authControllers.register(req, res));

export default router;
