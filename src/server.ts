import Fastify from "fastify";
import { rideEstimate } from "./routes/rideEstimate";
import { rideConfirm } from "./routes/rideConfirm";
import { rideDriver } from "./routes/rideDriver";
import { validateSchemaRideEstimate } from "./services/serviceValidateRideEstitmate";
import * as dotenv from 'dotenv';
import { validateSchemaRideConfirm } from "./services/serviceValidateRideConfirm";
import { validateSchemaRideDriver } from "./services/serviceValidateRideDriver";
import cors from "@fastify/cors";

dotenv.config();
const PORT_8080 = process.env.PORT_8080 || 0;
const app = Fastify({ logger: true });


const start = async () => {
    app.register(cors, {
        origin: "*",
    });
    await app.register( async (instance) => {
        instance.addHook("preHandler", validateSchemaRideEstimate);
        instance.register(rideEstimate);
    });    
    await app.register( async (instance) => {
        instance.addHook("preHandler", validateSchemaRideConfirm);
        instance.register(rideConfirm);
    });
    await app.register( async (instance) => {
        instance.addHook("preHandler", validateSchemaRideDriver);
        instance.register(rideDriver);
    });
    try{
        await app.listen({ port: Number(PORT_8080) });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();