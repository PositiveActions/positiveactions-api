const uuid = require('uuid/v4');

function generateUuid() {
    return uuid();
}

function getCurrrentTimestampSeconde() {
    return Math.floor(parseInt(Date.now(), 10) / 1000);
}
function buildResp(code, body) {
    return {
        statusCode: code,
        body: (body instanceof String) ? body : JSON.stringify(body),
    };
}

module.exports = {
    generateUuid,
    getCurrrentTimestampSeconde,
    buildResp,
};
