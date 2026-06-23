class Validator {

    campoObrigatorio(campo, mensagemErro = 'Este campo é obrigatório.') {
        if (!campo || campo.trim() === '') {
            const error = new Error(mensagemErro);
            error.statusCode = 422;
            throw error;
        }
    }   
}

module.exports = new Validator();

