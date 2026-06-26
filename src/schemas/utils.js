const { z } = require("zod");

const textoObrigatorio = (campo) =>
    z.string({
        error: (issue) => {
            if (issue.input === undefined) {
                return `O campo '${campo}' é obrigatório.`;
            }

            return `O campo '${campo}' deve ser um texto.`;
        }
    });


const numeroObrigatorio = (campo) =>
    z.number({
        error: (issue) => {
            if (issue.input === undefined) {
                return `O campo '${campo}' é obrigatório.`;
            }

            return `O campo '${campo}' deve ser um número.`;
        }
    });


const uuidObrigatorio = (campo) =>
    z.string({
        error: (issue) => {
            if (issue.input === undefined) {
                return `O campo '${campo}' é obrigatório.`;
            }

            return `O campo '${campo}' deve ser um texto (UUID).`;
        }
    });


module.exports = {textoObrigatorio, numeroObrigatorio, uuidObrigatorio};