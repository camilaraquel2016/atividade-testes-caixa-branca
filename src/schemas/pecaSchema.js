const { z } = require("zod");
const {textoObrigatorio, numeroObrigatorio, uuidObrigatorio} = require("./utils");

const pecaBaseSchema = z.object({

    codigo: textoObrigatorio("codigo")
        .trim()
        .min(1, "O código não pode estar vazio ou conter apenas espaços."),

    nome: textoObrigatorio("nome")
        .trim()
        .min(3, "O nome deve possuir pelo menos 3 caracteres."),

    qtd_estoque: numeroObrigatorio("qtd_estoque")
        .int("A 'qtd_estoque' deve ser um número inteiro.")
        .nonnegative("A 'qtd_estoque' não pode ser negativa."),

    preco: numeroObrigatorio("preço")
        .positive("O 'preco' deve ser maior que zero."),

    categoria_id: uuidObrigatorio("ID da categoria")
        .uuid("O 'categoria_id' informado não é um UUID válido."),

    situacao: z.enum(["ativa", "inativa"], {
        error: () => "A 'situacao' deve ser 'ativa' ou 'inativa'."
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