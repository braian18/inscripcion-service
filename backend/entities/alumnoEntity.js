import { EntitySchema } from "typeorm";

export const AlumnoEntity = new EntitySchema({
  name: "Alumno",
  tableName: "alumnos",
  columns: {
    id: { primary: true, type: "int", generated: true },
    nombre: { type: "varchar", length: 100 },
    apellido: { type: "varchar", length: 100 },
    dni: { type: "varchar", length: 15, unique: true },
    email: { type: "varchar", length: 100, unique: true },
  },
  relations: {
    inscripciones: {
      target: "Inscripcion",
      type: "one-to-many",
      inverseSide: "alumno",
    },
  },
});
