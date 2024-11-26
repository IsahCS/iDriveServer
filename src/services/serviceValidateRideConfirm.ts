import { FastifyReply, FastifyRequest } from "fastify";
import Joi from "joi";

const schema = Joi.object({
    customer_id: Joi.string().required().messages({
        "any.required": "Usuário não pode ser vazio.",
    }),
    origin: Joi.string().required().messages({
        "any.required": "Origem não pode ser vazio.",
    }),
    destination: Joi.string().required().messages({
        "any.required": "Destino não pode ser vazio.",
    }),
    distance: Joi.number().required().messages({
        "any.required": "Distância não pode ser vazio.",
    }),
    duration: Joi.string().required().messages({
        "any.required": "Duração não pode ser vazio.",
    }),
    driver: Joi.object({
        id: Joi.string().required().messages({
            "any.required": "ID do motorista não pode ser vazio.",
        }),
        name: Joi.string().required().messages({
            "any.required": "Nome do motorista não pode ser vazio.",
        }),
    }).required().messages({
        "any.required": "Motorista não pode ser vazio.",
    }),
    value: Joi.number().required().messages({
        "any.required": "Valor não pode ser vazio.",
    })
});

export async function validateSchemaRideConfirm (request: FastifyRequest, reply: FastifyReply) {
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