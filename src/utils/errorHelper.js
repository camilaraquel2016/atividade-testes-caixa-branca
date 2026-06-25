async function withMappedError(fn, errorMap) {
    try {
        return await fn();
    } catch (e) {
        const handler = (e.constraint ? errorMap[e.constraint] : null) || errorMap[e.code];

        if (!handler) throw e;

        const error = new Error(handler.message);
        error.statusCode = handler.statusCode;
        throw error;
    }
}

module.exports = { withMappedError }
