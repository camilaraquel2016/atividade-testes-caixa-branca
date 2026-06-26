const { z } = require("zod");
const { textoObrigatorio } = require("./utils")

const categoriaBaseSchema = z.object({

    nome: textoObrigatorio("nome")
        .trim()
        .min(3, "O nome da categoria deve possuir pelo menos 3 caracteres.")

});

const categoriaPostSchema = categoriaBaseSchema;

const categoriaPatchSchema = categoriaBaseSchema.partial();

module.exports = {
    categoriaPostSchema,
    categoriaPatchSchema
};