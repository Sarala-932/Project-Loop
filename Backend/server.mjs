import app from "./src/app.mjs";
import {config} from "./src/config/config.mjs";
import connectDB from "./src/config/db.mjs";

const startServer = async () => {
    try {
        await connectDB();
        app.listen(config.port, () => {
            console.log(`Server listening on port ${config.port}`);
        });
    } catch (error) {
        console.error("Failed to start server: ", error.message);
        process.exit(1);
    }
};

startServer();
