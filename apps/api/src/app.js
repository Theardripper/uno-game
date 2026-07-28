import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());

const swaggerDocument = YAML.load(path.join(import.meta.dirname, "./docs/swagger.yaml"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => res.send("API UNO running!"));

app.listen(PORT, () => {
    console.log("Server running in port 3000");
    console.log("Documentation available  http://localhost:3000/api-docs");
});
