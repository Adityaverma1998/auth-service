import app from "./app";
import { Config } from "./config";
import { AppDataSource } from "./config/data-source";
import logger from "./config/logger";

const startServer = async () => {
    try {
        const port = Config.PORT;

        await AppDataSource.initialize();
        logger.info("data base connect sucessfully!");
        app.listen(port, () => {
            logger.error("check error are here");
            logger.info(`Listening on Port ${port}`);
        });
    } catch (e) {
        console.log(`error are here ${e}`);
        process.exit(1);
    }
};
startServer();
