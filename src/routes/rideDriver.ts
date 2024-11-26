import { FastifyInstance } from "fastify";
import { getRideHistoryController } from "../controller/RideController";

export async function rideDriver(app: FastifyInstance) {
    app.get(
        "/ride/:customer_id", 
        getRideHistoryController
    );
}