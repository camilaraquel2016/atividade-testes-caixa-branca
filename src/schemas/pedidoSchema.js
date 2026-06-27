const { z } = require("zod");
const { uuidObrigatorio, numeroObrigatorio } = require("./utils");

const itemPedidoSchema = z.object({
    peca_id: uuidObrigatorio("ID da peça")
        .uuid("O ID da peça informado não é um UUID válido."),
    
    quantidade: numeroObrigatorio("quantidade")
        .int("A quantidade deve ser um número inteiro.")
        .positive("A quantidade deve ser maior que zero.")
});

const pedidoBaseSchema = z.object({
    cliente_id: uuidObrigatorio("ID do cliente")
        .uuid("O ID do cliente informado não é um UUID válido."),
    
    itens: z.array(itemPedidoSchema, {
    error: (issue) => {
        if (issue.input === undefined) {
            return "O campo 'itens' é obrigatório na criação do pedido.";
        }
        return "O campo 'itens' deve ser enviado no formato de lista (array).";
    }
    })
    .min(1, "Não é possível criar um pedido sem pelo menos um item.")
});

const pedidoPostSchema = pedidoBaseSchema;

const pedidoQuerySchema = z.object({
    situacao: z.string().optional(),
    cliente_id: z.string().uuid("O ID do cliente para filtro deve ser um UUID válido.").optional()
});

module.exports = {
    pedidoPostSchema,
    pedidoQuerySchema
};