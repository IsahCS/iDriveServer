import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { getDrivers } from "../map/driver";
import { PrismaClient } from "@prisma/client";

interface rideConfirm {
    customer_id: string;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driver: {
        id: string;
        name: string;
    }
    value: number;
}

const prisma = new PrismaClient();

export async function rideConfirm(app: FastifyInstance, options: FastifyPluginOptions) {
    app.patch("/ride/confirm", async (request: FastifyRequest<{ Body: rideConfirm }>, reply: FastifyReply) => {
        try {
            const { customer_id, origin, destination, distance, duration, driver, value } = request.body;

            if (!origin || !destination || !distance || !duration || !driver || !value || !customer_id) {
                return reply.status(400).send({
                    error_code: "INVALID_DATA",
                    error_description: "Os dados fornecidos no corpo da requisição são inválidos"
                });
            }

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
    });
}