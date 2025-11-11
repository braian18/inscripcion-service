// controllers/materiaController.js
import { AppDataSource } from "../db.js";

const materiaRepo = () => AppDataSource.getRepository("Materia");
const alumnoRepo = () => AppDataSource.getRepository("Alumno");
const inscripcionRepo = () => AppDataSource.getRepository("Inscripcion");

export const MateriaController = {
  async listarDisponibles(req, res) {
    try {
      const { alumno_id } = req.params;

      if (!alumno_id) {
        return res.status(400).json({ error: "Se requiere el ID del alumno" });
      }

      // Obtener el alumno con su carrera
      const alumno = await alumnoRepo().findOne({
        where: { id: alumno_id },
        relations: ["carrera"],
      });

      if (!alumno) {
        return res.status(404).json({ error: "Alumno no encontrado" });
      }

      if (!alumno.carrera) {
        return res.status(400).json({ error: "El alumno no está asignado a una carrera" });
      }

      // Obtener todas las materias de la carrera del alumno
      const materiasCarrera = await materiaRepo().find({
        where: { 
          carrera: { id: alumno.carrera.id } 
        },
        relations: ["carrera", "inscripciones"],
      });

      // Obtener las materias en las que el alumno ya está inscrito (activas)
      const inscripcionesActivas = await inscripcionRepo().find({
        where: {
          alumno: { id: alumno_id },
          estado: "ACTIVA",
        },
        relations: ["materia"],
      });

      const materiasInscritasIds = inscripcionesActivas.map(insc => insc.materia.id);

      // Filtrar materias disponibles (de la carrera y no inscritas)
      const materiasDisponibles = materiasCarrera.filter(materia => 
        !materiasInscritasIds.includes(materia.id)
      );

      res.json({
        alumno: `${alumno.nombre} ${alumno.apellido}`,
        carrera: alumno.carrera.nombre,
        materias_disponibles: materiasDisponibles
      });

    } catch (error) {
      console.error("Error al listar materias disponibles:", error);
      res.status(500).json({ error: "Error al obtener las materias disponibles" });
    }
  },
};