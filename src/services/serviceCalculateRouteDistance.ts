import * as dotenv from 'dotenv';
import { FastifyReply } from 'fastify';
import getAvailableDrivers from './serviceGetAvailableDrivers';

dotenv.config();
const googleMapsApiKey = process.env.API_KEY || '';

const calculateRouteDistance = async (body: EstimateRequest, reply: FastifyReply) => {
    const { origin, destination } = body;
    const rideRequest = createRideRequest(origin, destination);

    try {
        const data = await fetchRouteData(rideRequest);
        await handleRouteResponse(data, reply);
    } catch (error) {
        return reply.status(500).send({
            error_code: "ROUTE_ERROR",
            message: "Falha ao calcular a rota." + error,
        });
    }
};

const createRideRequest = (origin: string, destination: string): RideRequest => ({
    origin: { address: origin },
    destination: { address: destination },
});

const fetchRouteData = async (rideRequest: RideRequest) => {
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
    return response.json();
};

const handleRouteResponse = async (data: any, reply: FastifyReply) => {
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
        }
    } else {
        return reply.status(404).send({
            error_code: "ROUTE_NOT_FOUND",
            message: "Rota não encontrada.",
        });
    }
};

export default calculateRouteDistance;