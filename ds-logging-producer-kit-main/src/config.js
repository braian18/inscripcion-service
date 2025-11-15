/**
 *  config.js
 *
 *  Carga y valida la configuración del productor de eventos (logs) desde las variables de
 *  entorno en .env. Luego construye la URL de conexión con RabbitMQ y devuelve un objeto
 *  de configuración para que lo utilice el módulo producer.js.
 *
 */

import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

// Esquema Joi para validar y normalizar las variables de entorno.
export const cfgSchema = Joi.object({
  AMQP_USER: Joi.string().min(1).required(),
  AMQP_PASS: Joi.string().min(1).required(),
  AMQP_HOST: Joi.string().min(1).required(),
  AMQP_PORT: Joi.number().integer().min(1).max(65535).required(),

  // VHOST: por convención debería empezar con "/"
  AMQP_VHOST: Joi.string()
    .default("/")
    .custom((v, helpers) => {
      if (!v.startsWith("/")) return "/" + v;
      return v;
    }, "normalización de vhost"),

  // Exchange / routing
  AMQP_EXCHANGE: Joi.string().min(1).required(),
  AMQP_ROUTING_KEY: Joi.string().min(1).required(),

  // Identidad del módulo (nombre asignado por cada grupo)
  MODULE_NAME: Joi.string().min(1).required(),

  // Flag de validación (acepta "true"/"false" como strings y los convierte a boolean)
  VALIDATE: Joi.boolean().truthy("true").falsy("false").default(true),
}).unknown(false);

/**
 * Carga y validación de configuración desde process.env con posibilidad de overrides.
 * 
 * Nota: se abre la posibilidad de usar overrides para facilitar pruebas durante el desarrollo. En
 * ese caso, los overrides sobreescriben a los valores de process.env, si aparece la misma
 * variable (preeminencia de overrides por encima de process.env).
 * 
 */
const loadConfig = (overrides = {}) => {
  // Se toman SOLO las claves relevantes desde process.env
  const {
    AMQP_USER,
    AMQP_PASS,
    AMQP_HOST,
    AMQP_PORT,
    AMQP_VHOST,
    AMQP_EXCHANGE,
    AMQP_ROUTING_KEY,
    MODULE_NAME,
    VALIDATE,
  } = process.env;

  // Armar el "input" filtrado y aplicar overrides con mayor precedencia
  const filtered = {
    AMQP_USER,
    AMQP_PASS,
    AMQP_HOST,
    AMQP_PORT,
    AMQP_VHOST,
    AMQP_EXCHANGE,
    AMQP_ROUTING_KEY,
    MODULE_NAME,
    VALIDATE,
    ...overrides,
  };

  // Validación y normalización.
  // abortEarly=false : junta todos los errores.
  // convert=true : convierte a tipos válidos.
  const { value, error } = cfgSchema.validate(filtered, {
    abortEarly: false,
    convert: true,
  });
  if (error) {
    const details = error.details.map((d) => d.message).join("; ");
    throw new Error(`Configuración inválida: ${details}`);
  }

  // Construcción de la URL 
  const amqpUrl = `amqp://${encodeURIComponent(
    value.AMQP_USER
  )}:${encodeURIComponent(value.AMQP_PASS)}@${value.AMQP_HOST}:${
    value.AMQP_PORT
  }${value.AMQP_VHOST}`;

  // Devolución del objeto de configuración para el producer.
  return {
    amqpUrl,
    exchange: value.AMQP_EXCHANGE,
    routingKey: value.AMQP_ROUTING_KEY,
    moduleName: value.MODULE_NAME,
    validate: String(value.VALIDATE) !== "false",
  };
};

export { loadConfig };
