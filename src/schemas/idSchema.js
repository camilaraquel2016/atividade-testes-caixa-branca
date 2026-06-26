const { z } = require("zod");
const { uuidObrigatorio } = require("./utils");

const idSchema = z.object({
    id: uuidObrigatorio("id")
        .uuid("O ID informado não é um UUID válido.")
});

module.exports = idSchema;