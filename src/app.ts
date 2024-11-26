import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
    Express,
} from "express";
import logger from "./config/logger";
import createHttpError, { HttpError } from "http-errors";
import "reflect-metadata";
import bodyParser from "body-parser";

import authRouter from "./routes/auth";

const app: Express = express();
app.use(express.json());

app.use(bodyParser.json() as RequestHandler);
app.use(bodyParser.urlencoded({ extended: true }) as RequestHandler);

app.use("/auth", authRouter);

// global error handling
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    const codeStatus = err.statusCode || 500;
    res.status(codeStatus).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: "",
                location: "",
            },
        ],
    });
});

export default app;
