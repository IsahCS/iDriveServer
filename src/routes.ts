import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";

interface EstimateRequest {
    userId: string;
    origin: string;
    destination: string;
}

export async function routes(app: FastifyInstance, options: FastifyPluginOptions) {
    app.post("/ride/estimate", async (request: FastifyRequest<{ Body: EstimateRequest }>, reply: FastifyReply) => {
        const { userId, origin, destination } = request.body;

        if(!userId || !origin || !destination) {
            return reply.status(400).send({ error: "User ID, origin, and destination cannot be empty." });
        }

        if(origin === destination) {
            return reply.status(400).send({ error: "Origin and destination cannot be the same." });
        }
    });
}