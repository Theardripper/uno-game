import dotenv from "dotenv";
import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { connectDB } from "./config/db.js";

import apiRoutes from "./routes/api.routes.js";
import cardRoutes from "./routes/card.routes.js";
import gameRoutes from "./routes/game.routes.js";
import playerRoutes from "./routes/player.routes.js";
import scoreRoutes from "./routes/score.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

const swaggerDocument = YAML.load(path.join(import.meta.dirname, "./docs/swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Conecta ao MongoDB
connectDB();

// Registra as rotas conforme a especificação
app.use("/api/players", playerRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api", apiRoutes);

app.get("/", (req, res) => res.send("API UNO running!"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
    console.log(`Documentation available at http://localhost:${PORT}/api-docs`);
});
