/**
 *  index.js
 * 
 *  Re-exporta los recursos de producer.js, de manera que pueda ofrecerse siempre
 *  una única interfase a los consumidores del kit. Permite que los consumidores
 *  importes recursos sin usar las rutas internas del módulo (encapsulamento).
 * 
 *  Sintaxis de uso por parte de un consumidor:
 * 
 *      import { initProducer, sendLog, closeProducer } from "ds-logging-producer-kit";
 * 
 *  index.js actúa como fachada, si cambia la ruta o estructura interna del paquete,
 *  las importaciones de los usuarios seguirán funcionando.
 * 
 */
export { initProducer, sendLog, closeProducer} from "./producer.js";
