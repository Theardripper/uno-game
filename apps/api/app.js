import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();
app.use(express.json());

const swaggerDocument = YAML.load(path.join(import.meta.dirname, "./docs/swagger.yaml"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => res.send("API UNO Rodando!"));

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
    console.log("Documentação disponível em: http://localhost:3000/api-docs");
});
