import { EntitySchema } from "typeorm";

export const InscripcionEntity = new EntitySchema({
  name: "Inscripcion",
  tableName: "inscripciones",
  columns: {
    id: { primary: true, type: "int", generated: true },
    fecha_inscripcion: { type: "timestamp", createDateColumn: true },
    estado: {
      type: "enum",
      enum: ["ACTIVA", "CANCELADA", "FINALIZADA"],
      default: "ACTIVA",
    },
  },
  relations: {
    alumno: {
      target: "Alumno",
      type: "many-to-one",
      joinColumn: { name: "alumno_id" },
    },
    materia: {
      target: "Materia",
      type: "many-to-one",
      joinColumn: { name: "materia_id" },
    },
  },
});
