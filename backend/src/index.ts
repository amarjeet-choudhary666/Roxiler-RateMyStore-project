import { app } from "./app";
import { getPgVersion } from "./db";
import dotenv from "dotenv"
dotenv.config()

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

getPgVersion();
