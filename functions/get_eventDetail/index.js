const dynamodb = require('./utils/dynamodb');
const util = require('./utils/util');

const TABLE_COMMENT = 'events-comments';
const TABLE_PARTICIPANT = 'events-participants';
const TABLE_EVENT = 'events-list';

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

function buildParamsGet(eventId, tableName) {
    return {
        TableName: tableName,
        Key: {
            event_id: eventId,
        },
    };
}

async function checkEventExist(eventId) {
    const eventFound = await dynamodb.getItem(buildParamsGet(eventId, TABLE_EVENT));
    console.log(eventFound);
    if (Object.prototype.hasOwnProperty.call(eventFound, 'Item')) {
        return eventFound.Item;
    }
    return null;
}

module.exports.handler = async (event, context, callback) => {
    try {
        console.log('body', event.pathParameters); // Contains incoming request data (e.g., query params, headers and more)
        const eventId = event.pathParameters.event_id;
        // we insert the event in the event and user event list
        const eventInfo = await checkEventExist(eventId);
        if (eventInfo) {
            const [comments, participants] = await Promise.all([
                dynamodb.queryItems(buildParams(eventId, TABLE_COMMENT)),
                dynamodb.queryItems(buildParams(eventId, TABLE_PARTICIPANT))]);
            console.log('result', comments, participants);
            callback(null, util.buildResp(200, { comments, participants, info: eventInfo }));
            return;
        }
        callback(null, util.buildResp(404, `The event ${eventId} was not found`));
    } catch (err) {
        console.error(err);
        callback(util.buildResp(500, err));
    }
};
