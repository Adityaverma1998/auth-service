import app from "./app";
import { Config } from "./config";
import logger from "./config/logger";

const startServer = () => {
    try {
        const port = Config.PORT;

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
