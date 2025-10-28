CREATE DATABASE inscripcion CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE alumnos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  dni VARCHAR(15) UNIQUE,
  email VARCHAR(100) UNIQUE
);

CREATE TABLE carreras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100)
);

CREATE TABLE materias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  codigo VARCHAR(20) UNIQUE,
  cupo_maximo INT,
  carrera_id INT,
  FOREIGN KEY (carrera_id) REFERENCES carreras(id)
);

CREATE TABLE inscripciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alumno_id INT,
  materia_id INT,
  fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('ACTIVA','CANCELADA','FINALIZADA') DEFAULT 'ACTIVA',
  FOREIGN KEY (alumno_id) REFERENCES alumnos(id),
  FOREIGN KEY (materia_id) REFERENCES materias(id)
);
