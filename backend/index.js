import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { AppDataSource } from "./db.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Conectado a MariaDB");
    app.listen(PORT, () => {
      console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error al conectar con la base de datos:", error);
  });
