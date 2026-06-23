module.exports = (error, req, res, next) => {
    const status = error.statusCode || 500;
    return res.status(status).json({erro: error.message || "Erro interno do servidor."});
};