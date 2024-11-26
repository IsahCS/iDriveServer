import { FastifyInstance } from "fastify";
import { calculateRouteDistanceController } from "../controller/rideController";

export async function rideEstimate(app: FastifyInstance) {
    app.post(
        "/ride/estimate", 
        calculateRouteDistanceController
    );
}