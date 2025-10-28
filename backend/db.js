import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { DataSource } from "typeorm";
import { AlumnoEntity } from "./entities/alumnoEntity.js";
import { MateriaEntity } from "./entities/materiaEntity.js";
import { CarreraEntity } from "./entities/carreraEntity.js";
import { InscripcionEntity } from "./entities/inscripcionEntity.js";

export const AppDataSource = new DataSource({
  type: "mariadb",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [AlumnoEntity, MateriaEntity, CarreraEntity, InscripcionEntity],
});
