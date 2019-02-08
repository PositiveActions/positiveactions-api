const dynamodb = require('./utils/dynamodb');
const util = require('./utils/util');

const TABLE_COMMENT = 'events-comments';
const TABLE_PARTICIPANT = 'events-participants';

function buildParams(bodyRaw, tableName) {
    const body = JSON.parse(bodyRaw);
    return {
        TableName: tableName,
        Key: {
            event_id: body.event_id,
        },
    };
}

module.exports.handler = async (event, context, callback) => {
    try {
        console.log('body', event.body); // Contains incoming request data (e.g., query params, headers and more)
        // we insert the event in the event and user event list
        const [comments, participants] = await Promise.all([
            dynamodb.getItem(buildParams(event.body, TABLE_COMMENT)),
            dynamodb.getItem(buildParams(event.body, TABLE_PARTICIPANT))]);
        console.log('result', comments, participants);
        callback(null, util.buildResp(200, { comments, participants }));
    } catch (err) {
        console.error(err);
        callback(util.buildResp(500, err));
    }
};
