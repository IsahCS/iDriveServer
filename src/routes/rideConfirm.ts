import { FastifyInstance } from "fastify";
import { rideConfirmationController } from "../controller/rideController";

export async function rideConfirm(app: FastifyInstance) {
    app.patch(
        "/ride/confirm", 
        rideConfirmationController
    );
}