import cors from "cors";
import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import { env } from "#config/env.js";
import { errorHandler } from "#middlewares/errorHandler.middleware.js";
import { registerModuleRoutes } from "#modules/index.js";


/**
 * Creates and configures the Express application.
 * Separated from server.js to allow importing in tests without starting the server.
 */
export function createApp() {
    const app = express();

    // Global Middleware
    app.use(express.json());
    app.use(cors({ origin: env.CORS_ORIGIN }));

    //Depuração manual
    app.use((req, res, next) => {
        const start = Date.now();
        res.on("finish", () => {
            logger.info(${req.method} ${req.originalUrl} ${res.statusCode} - ${Date.now() - start}ms);
        });
        next();
    });

    // API Documentation
    const swaggerDocument = YAML.load(path.join(import.meta.dirname, "./docs/swagger.yaml"));
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Module Routes
    registerModuleRoutes(app);

    app.get("/", (req, res) => res.json({ status: "ok", message: "UNO Game API running!" }));
    app.get("/api/health", (req, res) => res.json({ status: "ok", version: "1.0.0", message: "API is healthy!" }));

    // Global Error Handle
    app.use(errorHandler);

    return app;
}
