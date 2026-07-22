import cors from "cors";
import express from "express";

import routes from "./routes/index.js";

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(routes);

export default app;
