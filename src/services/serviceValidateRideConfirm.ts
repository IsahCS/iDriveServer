import { FastifyReply, FastifyRequest } from "fastify";
import Joi from "joi";

const schema = Joi.object({
    customer_id: Joi.string().required().messages({
        "string.empty": "Usuário não pode ser vazio.",
    }),
    origin: Joi.string().required().messages({
        "string.empty": "Origem não pode ser vazio.",
    }),
    destination: Joi.string().required().messages({
        "string.empty": "Destino não pode ser vazio.",
    }),
    distance: Joi.number().required().messages({
        "number.base": "Distância deve ser um número.",
        "number.empty": "Distância não pode ser vazio.",
    }),
    duration: Joi.string().required().messages({
        "string.empty": "Duração não pode ser vazio.",
    }),
    driver: Joi.object({
        id: Joi.number().required().messages({
            "number.base": "ID do motorista deve ser um número.",
            "number.empty": "ID do motorista não pode ser vazio.",
        }),
        name: Joi.string().required().messages({
            "string.empty": "Nome do motorista não pode ser vazio.",
        }),
    }).required().messages({
        "object.base": "Motorista deve ser um objeto.",
        "object.empty": "Motorista não pode ser vazio.",
    }),
    value: Joi.number().required().messages({
        "number.base": "Valor deve ser um número.",
        "number.empty": "Valor não pode ser vazio.",
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