const uuid = require('uuid/v4');

function generateUuid() {
    return uuid();
}

function timestamp2date() {

}

function getCurrrentTimestampSeconde() {
    return Math.floor(parseInt(Date.now(), 10) / 1000);
}

function buildResp(code, body) {
    return {
        statusCode: code,
        headers: {
            'X-Requested-With': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
            'Access-Control-Allow-Origin': 'https://positiveactions.co',
            'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
        },
        body: (body instanceof String) ? body : JSON.stringify(body),
    };
}

module.exports = {
    generateUuid,
    timestamp2date,
    buildResp,
    getCurrrentTimestampSeconde,
};
