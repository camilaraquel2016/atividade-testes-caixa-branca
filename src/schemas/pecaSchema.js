const { z } = require("zod");
const {textoObrigatorio, numeroObrigatorio, uuidObrigatorio} = require("./utils");

const pecaBaseSchema = z.object({

    codigo: textoObrigatorio("código")
        .trim()
        .min(1, "O código não pode estar vazio ou conter apenas espaços."),

    nome: textoObrigatorio("nome")
        .trim()
        .min(3, "O nome deve possuir pelo menos 3 caracteres."),

    qtd_estoque: numeroObrigatorio("quantidade em estoque")
        .int("A quantidade em estoque deve ser um número inteiro.")
        .nonnegative("A quantidade em estoque não pode ser negativa."),

    preco: numeroObrigatorio("preço")
        .positive("O preço deve ser maior que zero."),

    categoria_id: uuidObrigatorio("ID da categoria")
        .uuid("O ID da categoria informado não é um UUID válido."),

    situacao: z.enum(["ativa", "inativa"], {
        error: () => "A situação deve ser 'ativa' ou 'inativa'."
    })

});



const pecaPostSchema = pecaBaseSchema.omit({
    situacao: true
});

const pecaPatchSchema = pecaBaseSchema.partial();

module.exports = {
    pecaPostSchema,
    pecaPatchSchema
};