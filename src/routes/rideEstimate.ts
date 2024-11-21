import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import * as dotenv from 'dotenv';
import { getDrivers } from "../map/driver";

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

export async function rideEstimate(app: FastifyInstance, options: FastifyPluginOptions) {
    app.post("/ride/estimate", async (request: FastifyRequest<{ Body: EstimateRequest }>, reply: FastifyReply) => {
        const { userId, origin, destination } = request.body;

        if (!userId || !origin || !destination) {
            return reply.status(400).send({ error: "User ID, origin, and destination cannot be empty." });
        }

        if (origin === destination) {
            return reply.status(400).send({ error: "Origin and Destination cannot be the same." });
        }

        try {
            const rideRequest: RideRequest = {
                origin: { address: origin },
                destination: { address: destination },
            };

            const routes = await calculateRouteDistance(rideRequest);

            if (routes && routes.duration && routes.distanceMeters) {
                const durationInSeconds = parseInt(routes.duration.split('s')[0], 10);
                const hours = Math.floor(durationInSeconds / 3600);
                const minutes = Math.floor((durationInSeconds % 3600) / 60);
                const distanceInMeters = routes.distanceMeters;
                const distanceInKm = parseFloat((distanceInMeters / 1000).toFixed(2));
                let duration;

                if (hours > 0 && minutes > 0) {
                    duration = `${hours} hrs ${minutes} mins`;
                } else if (hours > 0) {
                    duration = `${hours} hrs`;
                } else {
                    duration = `${minutes} mins`;
                }

                const availableDrivers = await getAvailableDrivers(Number(distanceInKm));
                const sortedDrivers = availableDrivers.sort((a, b) => parseFloat(a.value) - parseFloat(b.value));

                return reply.send({
                    origin:{
                        latitude: routes.origin.latLng.latitude,
                        longitude: routes.origin.latLng.longitude
                    },
                    destination:{
                        latitude: routes.destination.latLng.latitude,
                        longitude: routes.destination.latLng.longitude
                    },
                    distance: distanceInKm,
                    duration,
                    options: sortedDrivers,
                    routeResponse: routes.originalResponse,
                });
            }
        } catch (error) {
            return reply.status(500).send({ error: "failed to calculate route: " + error });
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
            'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.legs.startLocation,routes.legs.endLocation',
        },
        body: JSON.stringify(rideRequest),
    });
    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message || 'failed to calculate route distance');
    }

    if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];

        return {
            duration: route.duration,
            distanceMeters: route.distanceMeters, 
            origin: route.legs[0].startLocation, 
            destination: route.legs[0].endLocation,
            originalResponse: data, 
        };
    } else {
        throw new Error('no routes found');
    }
}

async function getAvailableDrivers(distanceInKm: number) {
    const drivers = await getDrivers();

    const availableDrivers = drivers
        .filter((driver) => distanceInKm >= driver.minKm) 
        .map((driver) => ({
            id: driver.id,
            name: driver.name,
            description: driver.description,
            vehicle: driver.car,
            review: {
                rating: driver.rating,
                comment: driver.review,
            },
            value: (distanceInKm * driver.ratePerKm).toFixed(2),
        }));

    return availableDrivers;
}
