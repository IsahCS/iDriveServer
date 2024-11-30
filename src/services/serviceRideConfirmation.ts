import getDrivers from "./serviceGetDriver";
import { FastifyReply } from "fastify";
import pool from "../../db";

pool.connect()
    .then(() => console.log('Conectado ao banco de dados'))
    .catch((err) => console.error('Erro ao conectar ao banco:', err));

const rideConfirmation = async (body: RideConfirm, reply: FastifyReply) => {
    const { customer_id, origin, destination, distance, duration, driver, value } = body;

    try {
        const drivers = await getDrivers();
        const selectedDriver = drivers.find((d) => d.id === driver.id);

        if (!selectedDriver) {
            return sendError(reply, 404, "DRIVER_NOT_FOUND", "Motorista não encontrado.");
        }

        if (distance < selectedDriver.minKm) {
            return sendError(reply, 406, "INVALID_DISTANCE", "Quilometragem inválida para o motorista");
        }

        await insertTrip({
            customer_id,
            origin,
            destination,
            distance,
            duration,
            driverId: selectedDriver.id,
            driverName: selectedDriver.name,
            value: parseFloat(value.toString())
        });

        return reply.status(200).send({
            success: true,
            message: "Operação realizada com sucesso",
        });
    } catch (error) {
        console.error("Erro ao realizar a confirmação da viagem:", error);
        return sendError(reply, 500, "INTERNAL_SERVER_ERROR", "Erro interno no servidor.");
    }
}

const sendError = (reply: FastifyReply, statusCode: number, errorCode: string, errorDescription: string) => {
    return reply.status(statusCode).send({
        error_code: errorCode,
        error_description: errorDescription
    });
}

const insertTrip = async (tripData: {
    customer_id: string,
    origin: string,
    destination: string,
    distance: number,
    duration: string,
    driverId: string,
    driverName: string,
    value: number
}) => {
    const insertTripQuery = `
        INSERT INTO trips (customer_id, origin, destination, distance, duration, driverId, driverName, value)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    const insertTripValues = [
        tripData.customer_id,
        tripData.origin,
        tripData.destination,
        tripData.distance,
        tripData.duration,
        tripData.driverId,
        tripData.driverName,
        tripData.value
    ];

    await pool.query(insertTripQuery, insertTripValues);
}

export default rideConfirmation;