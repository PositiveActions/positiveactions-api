const dynamodb = require('./utils/dynamodb');
const util = require('./utils/util');

const TABLE_COMMENT = 'events-comments';
// const TABLE_USEREVENT = 'users-events';

function buildParams(bodyRaw, tableName) {
    const body = JSON.parse(bodyRaw);
    return {
        TableName: tableName,
        Item: {
            event_id: body.event_id,
            user_id: util.generateUuid(),
            comment_id: util.generateUuid(),
            timestamp: parseInt(body.timestamp, 10),
            message: body.message,
        },
    };
}

module.exports.handler = async (event, context, callback) => {
    try {
        console.log('body', event.body); // Contains incoming request data (e.g., query params, headers and more)
        // we insert the event in the event and user event list
        const [newCommentCreated] = await Promise.all([dynamodb.createItem(buildParams(event.body, TABLE_COMMENT))]);
        console.log('result', newCommentCreated);
        callback(null, util.buidResp(200, newCommentCreated));
    } catch (err) {
        console.error(err);
        callback(util.buildResp(500, err));
    }
};
