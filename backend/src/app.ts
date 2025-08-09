import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ limit: '16kb', extended: true }));
app.use(cookieParser())

app.get('/health', (_req, res) => {
    res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

import userRoutes from "./routes/user.Routes";
import storeOwner from "./routes/storeowner.routes"
import adminRoutes from './routes/admin.routes'
import storeRoutes from './routes/store.routes'
import ratingRoutes from './routes/rating.routes'

app.use("/v1/api/users", userRoutes);
app.use("/v1/api/storeowner", storeOwner)
app.use("/v1/api/admin", adminRoutes)
app.use("/v1/api/stores", storeRoutes)
app.use("/v1/api/ratings", ratingRoutes)

export { app }
