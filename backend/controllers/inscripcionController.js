import { AppDataSource } from "../db.js";

const repo = () => AppDataSource.getRepository("Inscripcion");

export const InscripcionController = {
  async listar(req, res) {
    try {
      const { alumnoId } = req.query;

      const data = await repo().find({
        where: alumnoId ? { alumno: { id: alumnoId } } : {},
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

      // Verificar si ya existe una inscripción activa para esa materia
      const existente = await repo().findOne({
        where: {
          alumno: { id: alumno_id },
          materia: { id: materia_id },
          estado: "ACTIVA",
        },
      });

      if (existente) {
        return res.status(409).json({ error: "Ya estás inscrito en esta materia" });
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

  // 🔴 NUEVA FUNCIÓN: cancelar inscripción
  async cancelar(req, res) {
    try {
      const { id } = req.params;

      const inscripcion = await repo().findOne({ where: { id } });

      if (!inscripcion) {
        return res.status(404).json({ error: "Inscripción no encontrada" });
      }

      inscripcion.estado = "CANCELADA";
      await repo().save(inscripcion);

      res.json({ message: "Inscripción cancelada correctamente" });
    } catch (error) {
      console.error("Error al cancelar inscripción:", error);
      res.status(500).json({ error: "Error al cancelar inscripción" });
    }
  },
};
