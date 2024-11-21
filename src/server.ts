import cors from "@fastify/cors";
import Fastify from "fastify";
import { rideEstimate } from "./routes/rideEstimate";

const app = Fastify({ logger: true });

const start = async () => {
    await app.register(rideEstimate);
    try{
        await app.listen({ port: 8080 });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

start();