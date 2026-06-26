class servicesValidator {

    estoqueSuficiente(disponivel, solicitado, mensagemErro) {
        if (disponivel < solicitado) {
            const error = new Error(mensagemErro);
            error.statusCode = 400; 
            throw error;
        }
    }

    statusPedidoValido(status, mensagemErro = 'Status informado é inválido.') {
        const statusValidos = ['PENDENTE', 'CONFIRMADO', 'FINALIZADO', 'CANCELADO'];
        if (!statusValidos.includes(status)) {
            const error = new Error(mensagemErro);
            error.statusCode = 400;
            throw error;
        }
    }
}

module.exports = new servicesValidator();

