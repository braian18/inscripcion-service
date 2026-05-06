import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { AppDataSource } from "./db.js";
import app from "./app.js";

import { initProducer, closeProducer } from "ds-logging-producer-kit";

const PORT = process.env.PORT || 3000;

const main = async () => {
  await initProducer();

  try {
    await AppDataSource.initialize();
    console.log("Conectado a MariaDB");
  } catch (error) {
    console.error(" Error al conectar con la base de datos:", error);
    process.exit(1);
  }

  // Guardamos el server para poder cerrarlo después
  const server = app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
  });

  // Shutdown ordenado
  const safeClose = async () => {
    console.log(" Cerrando aplicación…");

    try {
      await closeProducer();
      console.log("Producer cerrado");
    } catch (err) {
      console.error("Error cerrando producer:", err);
    }

    try {
      await AppDataSource.destroy();
      console.log("Conexión a DB cerrada");
    } catch (err) {
      console.error(" Error cerrando DB:", err);
    }

    server.close(() => {
      console.log("Servidor detenido");
      process.exit(0);
    });
  };

  process.on("SIGINT", safeClose);
  process.on("SIGTERM", safeClose);
};

main();
