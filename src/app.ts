import express, { NextFunction, Request, Response } from "express";
import logger from "./config/logger";
import createHttpError, { HttpError } from "http-errors";

const app = express();

app.get("/", async (req, res, next) => {
    const err = createHttpError(401, "You can't access this router");
    next(err);
    // res.send("Welcome auth services");
});

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
