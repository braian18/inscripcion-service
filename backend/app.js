import express from "express";
import cors from "cors";
import inscripcionRoutes from "./routes/inscripcionRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/inscripciones", inscripcionRoutes);

app.get("/", (req, res) => {
  res.json({ mensaje: "API de Inscripción funcionando correctamente ✅" });
});

export default app;
