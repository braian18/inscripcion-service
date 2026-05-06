import express from "express";
import cors from "cors";
import inscripcionRoutes from "./routes/inscripcionRoutes.js";
import materiaRoutes from "./routes/materiasRoutes.js"; // 👈 Nueva importación
import rateLimit from "express-rate-limit"

const limiter = rateLimit({
  windowMs: 15*60*1000,
  limit:20,
  standardHeaders: true,  // Envía headers RateLimit-* estándar
  legacyHeaders: false,   // Desactiva headers X-RateLimit-* obsoletos
  message: { error: "Demasiadas peticiones, intentelo mas tarde"},
})



const app = express();

app.use(cors());
app.use(express.json());

app.use(limiter)

app.use("/api/inscripciones", inscripcionRoutes );
app.use("/api/materias", materiaRoutes);

app.get("/", (req, res) => {
  res.json({ mensaje: "API de Inscripción funcionando correctamente ✅" });
});

export default app;