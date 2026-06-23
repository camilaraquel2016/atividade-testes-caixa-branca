class Validator {

    campoObrigatorio(campo, mensagemErro = 'Este campo é obrigatório.') {
        if (!campo || campo.trim() === '') {
            const error = new Error(mensagemErro);
            error.statusCode = 422;
            throw error;
        }
    }

    validarCpf(cpf, mensagemErro = 'O CPF informado está em um formato inválido.') {
        const regexCpf = /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/;

        if (!regexCpf.test(cpf)) {
            const error = new Error(mensagemErro);
            error.statusCode = 422;
            throw error;
        }
    }

    validarTelefone(telefone, mensagemErro = 'O telefone informado está em um formato inválido.') {
        const regexTelefone = /^(\(?[1-9]{2}\)?\s?)?(9?\d{4}-?\d{4})$/;

        if (!regexTelefone.test(telefone)) {
            const error = new Error(mensagemErro);
            error.statusCode = 422;
            throw error;
        }
    }
}

module.exports = new Validator();

