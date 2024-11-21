import cors from "@fastify/cors";
import Fastify from "fastify";
import { routes } from "./routes";

const app = Fastify({ logger: true });

const start = async () => {
    await app.register(routes);
    try{
        await app.listen({ port: 8080 });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

start();