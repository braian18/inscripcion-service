/**
 *  CLI - Console-line Interfase para el kit ds-logging-producer-kit
 * 
 *  Permite enviar de manera rápida y fácil un mensaje de prueba a RabbitMQ.
 *  Se ejecuta desde la consola y está pensado para validar la conexión y (muy
 *  importante) los parámetros suministrador a través de .env.
 * 
 */

// Importación de los recursos para manejar el envío de mensajes (eventos).
import { initProducer, sendLog, closeProducer } from "./producer.js";

/** 
 *  Armado del mensaje de prueba: 
 *  
 *  El programa espera que se suministre un argumento que será el texto del mensaje que
 *  se desea enviar. Si no se suministra este argumento, enviará como mensaje "Evento de prueba CLI".
 * 
*/
const message = process.argv.slice(2).join(" ") || "Evento de prueba CLI";

// Función asincrónica que envía el mensaje
(async () => {
  // Inicialización de la conexión con el broker (RabbitMQ).
  await initProducer();
  // Envío del mensaje (función sendLog). Si se desea, suministrar otros datos para user y clientIP
  const id = await sendLog({
    user: "testCLI",
    clientIp: "0.0.0.0",
    message
  });
  // Mensaje en consola si el envío fue exitoso.
  console.log("Publicado con messageId (identificador):", id);
  await closeProducer();
})().catch(e => {
  // Mensaje en console si el envío falló.
  console.error(e);
  process.exit(1);
});

