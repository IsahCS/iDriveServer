import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import * as dotenv from 'dotenv';

interface EstimateRequest {
    userId: string;
    origin: string;
    destination: string;
}

interface RideRequest {
    origin: { address: string };
    destination: { address: string };
}

dotenv.config();
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || '';

export async function routes(app: FastifyInstance, options: FastifyPluginOptions) {
    app.post("/ride/estimate", async (request: FastifyRequest<{ Body: EstimateRequest }>, reply: FastifyReply) => {
        const { userId, origin, destination } = request.body;

        if(!userId || !origin || !destination) {
            return reply.status(400).send({ error: "user id, origin, and destination cannot be empty." });
        }

        if(origin === destination) {
            return reply.status(400).send({ error: "origin and destination cannot be the same." });
        }

        try{
            const rideRequest: RideRequest = {
                origin: { address: origin },
                destination: { address: destination }
            };
            const routes = await calculateRouteDistance(rideRequest);
            return { routes };
        }
        catch(error) {
            return reply.status(500).send({ error: error });
        }
    });
}

async function calculateRouteDistance(rideRequest: RideRequest) {
    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': googleMapsApiKey,
            'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters'
        },
        body: JSON.stringify(rideRequest)
    });
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error.message || 'failed to calculate route distance');
    }
    if (data.routes && data.routes.length > 0) {
        return data.routes[0];
    } else {
        throw new Error('no routes found');
    }
}