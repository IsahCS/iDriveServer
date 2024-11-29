import * as dotenv from 'dotenv';
import { FastifyReply } from 'fastify';
import { getAvailableDrivers } from './serviceGetAvailableDrivers';

interface RideRequest {
    origin: { address: string };
    destination: { address: string };
}

dotenv.config();
const googleMapsApiKey = process.env.API_KEY || '';

export async function calculateRouteDistance(body: EstimateRequest, reply: FastifyReply) {
    const { customer_id, origin, destination } = body;
    const rideRequest: RideRequest = {
        origin: { address: origin },
        destination: { address: destination },
    };
    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

    try {
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

        if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];

            if (route && route.duration && route.distanceMeters) {
                const availableDrivers = await getAvailableDrivers(route.distanceMeters);
                const sortedDrivers = availableDrivers.sort((a, b) => parseFloat(a.value) - parseFloat(b.value));

                return reply.send({
                    origin: route.legs[0].startLocation.latLng ? {
                        latitude: route.legs[0].startLocation.latLng.latitude,
                        longitude: route.legs[0].startLocation.latLng.longitude
                    } : {},
                    destination: route.legs[0].endLocation.latLng ? {
                        latitude: route.legs[0].endLocation.latLng.latitude,
                        longitude: route.legs[0].endLocation.latLng.longitude
                    } : {},
                    distance: route.distanceMeters,
                    duration: route.duration,
                    options: sortedDrivers,
                    routeResponse: data,
                });
            };
        } else {
            return reply.status(404).send({
                error_code: "ROUTE_NOT_FOUND",
                message: "Rota não encontrada.",
            });
        }
    } catch (error) {
        return reply.status(500).send({ 
            error_code: "ROUTE_ERROR",
            message: "Falha ao calcular a rota." + error,
        });
    }
}