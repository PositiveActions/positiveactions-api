const uuid = require('uuid/v4');

function generateUuid() {
    return uuid();
}

function timestamp2date() {

}


function buidResp(code, body) {
    return {
        statusCode: code,
        body: (body instanceof String) ? body : JSON.stringify(body),
    };
}

module.exports = {
    generateUuid,
    timestamp2date,
    buidResp,
};
