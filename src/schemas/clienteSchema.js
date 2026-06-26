const { z } = require("zod");
const { textoObrigatorio } = require("./utils");

const clienteBaseSchema = z.object({
    nome: textoObrigatorio("nome")
        .trim()
        .min(3, "O nome do cliente deve possuir pelo menos 3 caracteres."),

    cpf: textoObrigatorio("CPF")
        .trim()
        .regex(/^[0-9]{11}$|^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/, 
            "CPF formatado incorretamente. Use 11 dígitos puros ou o padrão XXX.XXX.XXX-XX"),

    telefone: textoObrigatorio("telefone")
        .trim()
        .regex(/^(\(?[1-9]{2}\)?\s?)?(9?\d{4}-?\d{4})$/, "O telefone informado está em um formato inválido.")
});

const clientePostSchema = clienteBaseSchema;

const clientePatchSchema = clienteBaseSchema.partial();

module.exports = {
    clientePostSchema,
    clientePatchSchema
};