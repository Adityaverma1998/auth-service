import app from "./app";
import { Config } from "./config";

const startServer = () => {
    try {
        const port = Config.PORT;

        app.listen(port, () => console.log(`Listening on Port ${port}`));
    } catch (e) {
        console.log(`error are here ${e}`);
        process.exit(1);
    }
};
startServer();
