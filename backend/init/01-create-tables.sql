SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- 1. Crear tablas SIN foreign keys primero
CREATE TABLE IF NOT EXISTS `carreras` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `alumnos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `dni` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `carrera_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dni` (`dni`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `materias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `cupo_maximo` int(11) NOT NULL,
  `carrera_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `inscripciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alumno_id` int(11) DEFAULT NULL,
  `materia_id` int(11) DEFAULT NULL,
  `fecha_inscripcion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('ACTIVA','CANCELADA','FINALIZADA') NOT NULL DEFAULT 'ACTIVA',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Insertar datos en el orden CORRECTO
-- Primero carreras (porque otras tablas dependen de ella)
INSERT IGNORE INTO `carreras` (`id`, `nombre`) VALUES
(1, 'Tecnico Superior en Desarrollo de Software FullStack'),
(2, 'Tecnico Superior en Devops');

-- Luego alumnos (depende de carreras)
INSERT IGNORE INTO `alumnos` (`id`, `nombre`, `apellido`, `dni`, `email`, `carrera_id`) VALUES
(1, 'Juan', 'Perez', '43484641', 'Juajuajuan@gmail.com', 1),
(2, 'sebastian', 'gomez', '48759561', 'seb@ejemplo.com', 2);

-- Luego materias (depende de carreras)
INSERT IGNORE INTO `materias` (`id`, `nombre`, `codigo`, `cupo_maximo`, `carrera_id`) VALUES
(1, 'Ingles tecnico 1', 'FS1', 30, 1),
(2, 'Matematicas', 'FS2', 30, 1),
(3, 'Laboratorio fullstack 1', 'FS3', 30, 1),
(4, 'Arquitectura de las computadoras', 'FS4', 30, 1),
(5, 'Programacion', 'FS5', 30, 1),
(6, 'Base de Datos', 'FS6', 30, 1),
(7, 'Diseño UI/UX', 'FS7', 30, 1),
(8, 'Practicas profesionalizantes', 'FS8', 30, 1),
(10, 'Ingles 1', 'DOPS1', 30, 2),
(11, 'Cultura DevOps y Adopcion', 'DOPS2', 30, 2),
(12, 'Metodologias agiles', 'DOPS3', 30, 2),
(13, 'Control de Versiones', 'DOPS4', 30, 2),
(14, 'Aplicaciones cloud nativas', 'DOPS5', 30, 2),
(15, 'Sistemas Operativos', 'DOPS6', 30, 2),
(16, 'Automatizacion y scripting', 'DOPS7', 30, 2),
(17, 'Laboratorio 1', 'DOPS8', 30, 2);

-- Finalmente inscripciones (depende de alumnos y materias)
INSERT IGNORE INTO `inscripciones` (`id`, `alumno_id`, `materia_id`, `fecha_inscripcion`, `estado`) VALUES
(1, 1, 1, '2025-11-10 21:01:11', 'ACTIVA');

-- 3. Agregar foreign keys AL FINAL
ALTER TABLE `alumnos`
  ADD CONSTRAINT `FK_90a28499428f89f774358ae42f0` FOREIGN KEY (`carrera_id`) REFERENCES `carreras` (`id`);

ALTER TABLE `inscripciones`
  ADD CONSTRAINT `FK_6a0aa3eb23adcb649570ed074ca` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`),
  ADD CONSTRAINT `FK_7449742dd173fe87d60167a3e64` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`);

ALTER TABLE `materias`
  ADD CONSTRAINT `FK_3d5f138169652e9bea438af46e8` FOREIGN KEY (`carrera_id`) REFERENCES `carreras` (`id`);

COMMIT;