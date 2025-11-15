/**
 *  schema.js:
 *
 *  Define la validación de los mensajes (payload) que se publicarán, mediante
 *  el uso de Joi.
 *  Por contrato, todos los mensajes deben tener información específica para cada
 *  argumento.
 *
 */

import Joi from "joi";

const logSchema = Joi.object({
  // ID del mensaje (generado automáticamente en el producer)
  messageId: Joi.string().uuid({ version: "uuidv4" }).required(),

  // Fecha y hora del evento GMT0 (generado automáticamente en el producer)
  timestamp: Joi.string().isoDate().required(),

  // Nivel: en el contrato actual decimos que solo aceptamos INFO pero en
  // realidad podemos aceptar otros valores estándar.
  level: Joi.string().valid("INFO", "WARN", "ERROR", "DEBUG").default("INFO"),

  // Módulo: nombre del módulo que origina el mensaje
  module: Joi.string().min(1).max(100).required(),

  // Usuario que origina el mensaje.
  user: Joi.string().min(1).max(120).required(),

  // IP pública del cliente.
  clientIp: Joi.string()
    .ip({ version: ["ipv4", "ipv6"] })
    .required(),

  // Mensaje:
  message: Joi.string().min(1).max(512).required(),
}).required();

export { logSchema };
