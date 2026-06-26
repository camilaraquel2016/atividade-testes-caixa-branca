const validarRequisicao = (schema, origem = "body") => {
    return (req, res, next) => {

        const resultado = schema.safeParse(req[origem]);

        if (!resultado.success) {
            const errosFormatados = resultado.error.issues.map(err => ({
                campo: err.path[0],
                mensagem: err.message
            }));

            return res.status(400).json({
                erro: "Validação de dados falhou.",
                detalhes: errosFormatados
            });
        }

        req[origem] = resultado.data;

        next();
    };
};

module.exports = validarRequisicao;