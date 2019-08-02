function buildResp(code, body) {
    return {
        statusCode: code,
        headers: {
            'X-Requested-With': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
            'Access-Control-Allow-Origin': 'https://positiveactions.co',
            'Access-Control-Allow-Methods': 'GET,OPTIONS',
        },
        body: (body instanceof String) ? body : JSON.stringify(body),
    };
}

module.exports = {
    buildResp,
};
