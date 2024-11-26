import { FastifyInstance } from "fastify";
import { rideConfirmationController } from "../controller/RideController";

export async function rideConfirm(app: FastifyInstance) {
    app.patch(
        "/ride/confirm", 
        rideConfirmationController
    );
}