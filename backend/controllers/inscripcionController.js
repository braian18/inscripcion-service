import { AppDataSource } from "../db.js";

const repo = () => AppDataSource.getRepository("Inscripcion");

export const InscripcionController = {
  async listar(req, res) {
    try {
      const data = await repo().find({
        relations: ["alumno", "materia"],
      });
      res.json(data);
    } catch (error) {
      console.error("Error al listar inscripciones:", error);
      res.status(500).json({ error: "Error al obtener las inscripciones" });
    }
  },

  async crear(req, res) {
    try {
      const { alumno_id, materia_id } = req.body;
      if (!alumno_id || !materia_id) {
        return res.status(400).json({ error: "Datos incompletos" });
      }

      const nueva = repo().create({
        alumno: { id: alumno_id },
        materia: { id: materia_id },
      });

      await repo().save(nueva);
      res.status(201).json(nueva);
    } catch (error) {
      console.error("Error al crear inscripción:", error);
      res.status(500).json({ error: "Error al crear inscripción" });
    }
  },
};
