import { FastifyInstance } from "fastify";
import { calculateRouteDistanceController } from "../controller/RideController";

export async function rideEstimate(app: FastifyInstance) {
    app.post(
        "/ride/estimate", 
        calculateRouteDistanceController
    );
}