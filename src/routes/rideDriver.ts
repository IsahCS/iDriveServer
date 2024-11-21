import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import { getDrivers } from "../map/driver";

interface rideDriverParams {
    customer_id: string;
}

interface rideDriverQuery {
    driver_id?: string;
}

const prisma = new PrismaClient();

export async function rideDriver(app: FastifyInstance, options: FastifyPluginOptions) {
    app.get("/ride/:customer_id", async (request: FastifyRequest<{ Params: rideDriverParams, Querystring: rideDriverQuery }>, reply: FastifyReply) => {
        try {
            const { customer_id } = request.params;
            const { driver_id } = request.query;

            console.log("customer_id:", customer_id);
            console.log("driver_id:", driver_id);

            if (!customer_id) {
                return reply.status(400).send({
                    error_code: "INVALID_CUSTOMER",
                    error_description: "Usuário inválido."
                });
            }

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

            console.log("customer_id:", customer_id);
            console.log("selectedDriverId:", selectedDriverId);

            const trips = await prisma.trip.findMany({
                where: {
                    customer_id,
                    ...(selectedDriverId && { driverId: selectedDriverId }),
                },
            });

            console.log("trips:", trips);

            if (trips.length === 0) {
                return reply.status(404).send({
                    error_code: "NO_RIDES_FOUND",
                    error_description: "Nenhum registro encontrado."
                });
            }

            return reply.send(trips);
        } catch (error) {
            console.error("error fetching trips:", error);
            return reply.status(500).send({
                error_code: "INTERNAL_SERVER_ERROR",
                error_description: "Erro interno no servidor."
            });
        }
    });
}