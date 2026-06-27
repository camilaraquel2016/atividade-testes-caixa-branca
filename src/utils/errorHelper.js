async function withMappedError(fn, errorMap) {
    try {
        return await fn();
    } catch (e) {
        const handler = (e.constraint ? errorMap[e.constraint] : null) || errorMap[e.code];

        if (!handler) throw e;

        throw new handler.error(handler.message)
    }
}

module.exports = { withMappedError }
