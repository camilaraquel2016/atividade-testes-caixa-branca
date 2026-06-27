const BusinessError = require("../exceptions/BusinessError");

class servicesValidator {

    estoqueSuficiente(disponivel, solicitado, mensagemErro) {
        if (disponivel < solicitado) {
            throw new BusinessError(mensagemErro);
        }
    }

    statusPedidoValido(status, mensagemErro = 'Status informado é inválido.') {
        const statusValidos = ['PENDENTE', 'CONFIRMADO', 'FINALIZADO', 'CANCELADO'];
        if (!statusValidos.includes(status)) {
            throw new BusinessError(mensagemErro);
        }
    }
}

module.exports = new servicesValidator();

