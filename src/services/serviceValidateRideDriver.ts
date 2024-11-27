import Joi from "joi";

const schema = Joi.object({
    customer_id: Joi.string().required().messages({
        "string.empty": "Usuário não pode ser vazio.",
    })
});

export async function validateSchemaRideDriver (request: any, reply: any) {
    try {
        await schema.validateAsync(request.params, { abortEarly: true });
    } catch (err) {
        const error = (err as any).details;
        return reply.status(400).send({
            error_code: "INVALID_DATA",
            error_message: "Os dados fornecidos no corpo da requisição são inválidos.",
            error: error.map((error: any) => error.message),
        });
    }
};