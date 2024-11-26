import { PrismaClient } from "@prisma/client";
import { getDrivers } from "./serviceGetDriver";
import { FastifyReply } from "fastify";

const prisma = new PrismaClient();

export async function rideConfirmation(body: RideConfirm, reply: FastifyReply) {
    const { customer_id, origin, destination, distance, duration, driver, value } = body;
    try {
        const drivers = await getDrivers();
        const selectedDriver = drivers.find((d) => d.id === driver.id);

        if (!selectedDriver) {
            return reply.status(404).send({
                error_code: "DRIVER_NOT_FOUND",
                error_description: "Motorista não encontrado."
            });
        }

        if (distance < selectedDriver.minKm) {
            return reply.status(406).send({
                error_code: "INVALID_DISTANCE",
                error_description: "Quilometragem inválida para o motorista"
            });
        }

        await prisma.trip.create({
            data: {
                customer_id,
                origin,
                destination,
                distance,
                duration,
                driverId: selectedDriver.id,
                driverName: selectedDriver.name,
                value: parseFloat(value.toString()),
            },
        });

        return reply.status(200).send({
            success: true,
            message: "Operação realizada com sucesso",
        })
    } catch (error) {
        return reply.status(500).send({
            error_code: "INTERNAL_SERVER_ERROR",
            error_description: "Erro interno no servidor."
        });
    }
}