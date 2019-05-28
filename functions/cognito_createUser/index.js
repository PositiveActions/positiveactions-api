const dynamodb = require('./utils/dynamodb');
const util = require('./utils/util');

const TABLE_USER = 'users-list';

function buildParams(bodyRaw, tableName) {
    return {
        TableName: tableName,
        Item: {
            user_id: bodyRaw.sub,
            timestamp: util.getCurrrentTimestampSeconde(),
            username: bodyRaw.preferred_username,
            email: bodyRaw.email,
        },
    };
}

module.exports.handler = async (event, context, callback) => {
    try {
        console.log('body', event); // Contains incoming request data (e.g., query params, headers and more)
        await dynamodb.createItem(buildParams(event.request.userAttributes, TABLE_USER));
        callback(null, event);
    } catch (err) {
        console.error(err);
        callback(util.buildResp(500, err));
    }
};
