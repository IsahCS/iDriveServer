import { FastifyReply, FastifyRequest } from "fastify";
import Joi from "joi";

const schema = Joi.object({
    customer_id: Joi.string().required().messages({
        "string.empty": "Id do usuário não pode ser vazio.",
    }),
    origin: Joi.string().required().messages({
        "string.empty": "Origem não pode ser vazio.",
    }),
    destination: Joi.string().required().messages({
        "string.empty": "Destino não pode ser vazio.",
    }),
}).custom((value, helpers) => {
    if (value.origin === value.destination) {
        return helpers.error("Origem e destino não podem ser iguais.");
    }
    return value;
    }
);

export async function validateSchemaRideEstimate (request: FastifyRequest, reply: FastifyReply) {
    try {
        await schema.validateAsync(request.body, { abortEarly: true });
    } catch (err) {
        const error = (err as any).details;
        return reply.status(400).send({
            error_code: "INVALID_DATA",
            error_message: "Os dados fornecidos no corpo da requisição são inválidos.",
            error: error.map((error: any) => error.message),
        });
    }
};
