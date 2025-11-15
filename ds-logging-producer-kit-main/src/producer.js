/**
 *  producer.js
 * 
 *  Contiene la lógica de conexión a Rabbit y de publicación de los mensajes en el exchange
 *  configurado.
 * 
 */

import amqplib from "amqplib";
import { v4 as uuidv4 } from "uuid";
import { loadConfig } from "./config.js";
import { logSchema } from "./schema.js"; // Se asume existente en tu repo

// Variables para manejar la conexión con Rabbit. 
//
// -conn: guarda la conexión con Rabbit.
let _conn = null;
// _ch: almacena el canal de confirmación.
let _ch = null;
// _cfg: guarda la configuración cargada.
let _cfg = null;

// Inicialización de conexión con Rabbit
async function initProducer(overrides = {}) {
  // Evita reabrir conexión si ya existe conexión y canal.
  if (_ch && _conn) return; 

  // Carga de la configuración desde config.js. Se usó overrides para permitir
  // sobreescribir los valores que se originan en las variables de entorno (.env)
  // para usar otros parámetros (ej., para usar otra ampURL en una prueba)
  _cfg = loadConfig(overrides);

  // Conexión al broker y creación de un canal de confirmación (permite esperar un ACK
  // para garantizar que el mensaje fue aceptado).
  _conn = await amqplib.connect(_cfg.amqpUrl);
  _ch = await _conn.createConfirmChannel();

  // Confirma que el exchange exista y sino, lo crea (durable=persiste en reinicios del broker)
  await _ch.assertExchange(_cfg.exchange, "topic", { durable: true });

  // Función para ejecutar un cierre de forma segura, ante señales de sistema
  // SIGINT: cuando el usuario hacer Ctrl-C en la terminal.
  // SIGTERM: señal estandar para pedir que un proceso termine (ej.: docker stop).
  const safeClose = async () => {
    try { await closeProducer(); } catch {}
  };
  process.once("SIGINT", safeClose);
  process.once("SIGTERM", safeClose);
}

// Publicación del mensaje en el exchange.
async function sendLog(payload = {}, options = {}) {
  // El mensaje se publicará correctamente si antes se llamó a initProducer(), por lo
  // tanto se evalúa las variavles _ch y _cfg que configura ese proceso
  if (!_ch || !_cfg) {
    throw new Error("Producer no inicializado. Llame primero a initProducer().");
  }

  // Construcción del mensaje.
  // Atención: aquí se calcula el id del mensaje (uuidv4) y la fecha y hora de envío (hora GMT0 Greenwich) y
  // luego se agrega el nombre del módulo 
  const candidate = {
    messageId: uuidv4(),                  // ID único 
    timestamp: new Date().toISOString(),
    module: _cfg.moduleName,
    // Si no llega a través del payload (objeto Json) se impone "INFO".
    level: payload.level || "INFO",
    ...payload,
  };

  let value = candidate;

  if (_cfg.validate) {
    const { error, value: valid } = logSchema.validate(candidate, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });
    if (error) {
      const details = error.details.map(d => d.message).join("; ");
      throw new Error(`Payload inválido: ${details}`);
    }
    value = valid;
  }

  const routingKey = options.routingKey || _cfg.routingKey;
  const headers = { module: _cfg.moduleName, ...options.headers };

  // Publicación con confirmaciones (persistente)
  _ch.publish(
    _cfg.exchange,
    routingKey,
    Buffer.from(JSON.stringify(value)),
    {
      contentType: "application/json",
      deliveryMode: 2, // persistente
      headers,
      timestamp: Date.now(),
      messageId: value.messageId,
      type: value.level,
      appId: _cfg.moduleName,
    }
  );

  await _ch.waitForConfirms(); // garantiza que RabbitMQ lo aceptó
  return value.messageId;
}

/** Cierra canal y conexión si existen. */
async function closeProducer() {
  try { await _ch?.close(); } catch {}
  try { await _conn?.close(); } catch {}
  _ch = null;
  _conn = null;
  _cfg = null;
}

export { initProducer, sendLog, closeProducer };
