function buildResp(code, body) {
    return {
        statusCode: code,
        body: (body instanceof String) ? body : JSON.stringify(body),
    };
}

module.exports = {
    buildResp,
};
