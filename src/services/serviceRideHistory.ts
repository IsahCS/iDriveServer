import { FastifyReply } from "fastify";
import { getDrivers } from "./serviceGetDriver";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getRideHistory(customer_id: string, driver_id: string, reply: FastifyReply) {
    try {
        let selectedDriverId: string | null = null;

        if (driver_id) {
            const drivers = await getDrivers();
            const selectedDriver = drivers.find((d) => d.id === driver_id);

            if (!selectedDriver) {
                return reply.status(400).send({
                    error_code: "INVALID_DRIVER",
                    error_description: "Motorista inválido."
                });
            }

            selectedDriverId = selectedDriver.id;
        }

        const trips = await prisma.trip.findMany({
            where: {
                customer_id,
                ...(selectedDriverId && { driverId: selectedDriverId }),
            },
        });

        if (trips.length > 0) {
            const rides = {
                customer_id: trips[0].customer_id,
                rides: trips.map((trip) => ({
                    id: trip.id,
                    date: trip.createdAt,
                    origin: trip.origin,
                    destination: trip.destination,
                    distance: trip.distance,
                    duration: trip.duration,
                    driver: {
                        id: trip.driverId,
                        name: trip.driverName,
                    },
                    value: trip.value,
                })),
            };
            return rides;
        }
        else {
            return reply.status(404).send({
                error_code: "NO_RIDES_FOUND",
                error_description: "Nenhum registro encontrado."
            });
        }
    } catch (error) {
        return reply.status(500).send({
            error_code: "INTERNAL_SERVER_ERROR",
            error_description: "Erro interno no servidor."
        });
    }
}