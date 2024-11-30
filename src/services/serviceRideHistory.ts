import { FastifyReply } from "fastify";
import getDrivers from "./serviceGetDriver";
import pool from "../../db";

const getRideHistory = async (customer_id: string, driver_id: string, reply: FastifyReply) => {
    try {
        const selectedDriverId = await getSelectedDriverId(driver_id, reply);
        if (selectedDriverId === null && driver_id) return;

        const client = await pool.connect();
        try {
            const rides = await fetchRideHistory(client, customer_id, selectedDriverId);
            if (rides.length > 0) {
                return reply.status(200).send(formatRideHistory(customer_id, rides));
            } else {
                return sendError(reply, 404, "NO_RIDES_FOUND", "Nenhum registro encontrado.");
            }
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Erro ao obter histórico de viagens:", error);
        return sendError(reply, 500, "INTERNAL_SERVER_ERROR", "Erro interno no servidor.");
    }
}

const getSelectedDriverId = async (driver_id: string, reply: FastifyReply): Promise<number | null> => {
    if (!driver_id) return null;

    const drivers = await getDrivers();
    const selectedDriver = drivers.find((d: Driver) => d.id === parseInt(driver_id));

    if (!selectedDriver) {
        sendError(reply, 400, "INVALID_DRIVER", "Motorista inválido.");
        return null;
    }

    return selectedDriver.id;
}

const fetchRideHistory = async (client: any, customer_id: string, driver_id: number | null) => {
    const query = `
        SELECT * FROM trips
        WHERE customer_id = $1
        ${driver_id ? 'AND driverId = $2' : ''}
    `;
    const values = driver_id ? [customer_id, driver_id] : [customer_id];
    const result = await client.query(query, values);
    return result.rows;
}

const formatRideHistory = (customer_id: string, trips: Trip[]): RideHistory => {
    return {
        customer_id,
        rides: trips.map((trip: Trip) => ({
            id: trip.id,
            date: trip.createdat,
            origin: trip.origin,
            destination: trip.destination,
            distance: trip.distance,
            duration: trip.duration,
            driver: {
                id: trip.driverid,
                name: trip.drivername,
            },
            value: trip.value,
        })),
    };
}

const sendError = (reply: FastifyReply, statusCode: number, errorCode: string, errorDescription: string) => {
    return reply.status(statusCode).send({
        error_code: errorCode,
        error_description: errorDescription
    });
}

export default getRideHistory;