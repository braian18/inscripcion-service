import { EntitySchema } from "typeorm";

export const MateriaEntity = new EntitySchema({
  name: "Materia",
  tableName: "materias",
  columns: {
    id: { primary: true, type: "int", generated: true },
    nombre: { type: "varchar", length: 100 },
    codigo: { type: "varchar", length: 20, unique: true },
    cupo_maximo: { type: "int" },
  },
  relations: {
    carrera: {
      target: "Carrera",
      type: "many-to-one",
      joinColumn: { name: "carrera_id" },
    },
    inscripciones: {
      target: "Inscripcion",
      type: "one-to-many",
      inverseSide: "materia",
    },
  },
});
