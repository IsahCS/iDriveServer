import { FastifyReply, FastifyRequest } from "fastify";
import calculateRouteDistance from "../services/serviceCalculateRouteDistance";
import getRideHistory from "../services/serviceRideHistory";
import rideConfirmation from "../services/serviceRideConfirmation";

const calculateRouteDistanceController = async (request: FastifyRequest<{ Body: EstimateRequest }>, reply: FastifyReply) => {
    return await calculateRouteDistance(request.body, reply);
};

const getRideHistoryController = async (request: FastifyRequest<{ Params: RideDriverParams, Querystring: RideDriverQuery }>, reply: FastifyReply) => {
    return await getRideHistory(request.params.customer_id, request.query.driver_id ?? '', reply);
};

const rideConfirmationController = async (request: FastifyRequest<{ Body: RideConfirm }>, reply: FastifyReply) => {
    return await rideConfirmation(request.body, reply);
};

export { calculateRouteDistanceController, getRideHistoryController, rideConfirmationController };