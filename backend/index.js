import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { AppDataSource } from "./db.js";
import app from "./app.js";

import {initProducer, closeProducer} from "ds-logging-producer-kit"


const PORT = process.env.PORT || 3000;

const main = async () => {

  await initProducer();

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

  const safeCLose = async () => {
    try {
      await closeProducer();
    } catch (error) {
      process.exit(0)
    }
  }
  process.once("SIGINT", safeCLose);
  process.once("SIGTERM", safeCLose)
};

main();
