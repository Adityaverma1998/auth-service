import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";
import { AuthControllers } from "../controllers/AuthControllers";
import { UserService } from "../services/userServices";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import registerValidator from "../validator/registration-validator";
const router = express.Router();
const userReposistory = AppDataSource.getRepository(User);

const userSerices = new UserService(userReposistory);
const authControllers = new AuthControllers(userSerices, logger);

router.post(
    "/register",
    registerValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        authControllers.register(req, res, next);
    },
);

export default router;
