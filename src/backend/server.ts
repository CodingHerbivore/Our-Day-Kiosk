import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import weatherRoutes from "./routes/open-meteo.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({ logger: true });

// Serve the static frontend files
//
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "../frontend"),
  prefix: "/",
});

fastify.register(fastifyStatic, {
  root: path.resolve(__dirname, "../../node_modules/bootstrap/dist"),
  prefix: "/bootstrap/",
  decorateReply: false,
});

fastify.register(weatherRoutes);

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3002, host: "0.0.0.0" });
    console.log("Kisok server live at http://localhost:3002");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
