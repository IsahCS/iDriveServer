import { FastifyInstance } from "fastify";
import { getRideHistoryController } from "../controller/rideController";

export async function rideDriver(app: FastifyInstance) {
    app.get(
        "/ride/:customer_id", 
        getRideHistoryController
    );
}