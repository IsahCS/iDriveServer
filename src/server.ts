import cors from "@fastify/cors";
import Fastify from "fastify";
import { rideEstimate } from "./routes/rideEstimate";
import { rideConfirm } from "./routes/rideConfirm";
import { rideDriver } from "./routes/rideDriver";

const app = Fastify({ logger: true });

const start = async () => {
    await app.register(rideEstimate);
    await app.register(rideConfirm);
    await app.register(rideDriver);
    try{
        await app.listen({ port: 8080 });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

start();