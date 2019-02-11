const dynamodb = require('./utils/dynamodb');
const util = require('./utils/util');

const TABLE_COMMENT = 'events-comments';
const TABLE_PARTICIPANT = 'events-participants';

function buildParams(eventId, tableName) {
    return {
        TableName: tableName,
        KeyConditionExpression: '#event_id = :event_id',
        ExpressionAttributeNames: {
            '#event_id': 'event_id',
        },
        ExpressionAttributeValues: {
            ':event_id': eventId,
        },
        //  get the latest data
        ScanIndexForward: false,
    };
}

module.exports.handler = async (event, context, callback) => {
    try {
        console.log('body', event.pathParameters); // Contains incoming request data (e.g., query params, headers and more)
        // we insert the event in the event and user event list
        const [comments, participants] = await Promise.all([
            dynamodb.queryItems(buildParams(event.pathParameters.event_id, TABLE_COMMENT)),
            dynamodb.queryItems(buildParams(event.pathParameters.event_id, TABLE_PARTICIPANT))]);
        console.log('result', comments, participants);
        callback(null, util.buildResp(200, { comments, participants }));
    } catch (err) {
        console.error(err);
        callback(util.buildResp(500, err));
    }
};
