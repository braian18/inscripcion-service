import { EntitySchema } from "typeorm";

export const CarreraEntity = new EntitySchema({
  name: "Carrera",
  tableName: "carreras",
  columns: {
    id: { primary: true, type: "int", generated: true },
    nombre: { type: "varchar", length: 100 },
  },
  relations: {
    materias: {
      target: "Materia",
      type: "one-to-many",
      inverseSide: "carrera",
    },
  },
});
