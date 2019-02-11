const dynamodb = require('./utils/dynamodb');
const util = require('./utils/util');

const TABLE_COMMENT = 'events-comments';
const TABLE_EVENTS = 'events-list';

function buildParams(bodyRaw, tableName) {
    const body = JSON.parse(bodyRaw);
    return {
        TableName: tableName,
        Item: {
            event_id: body.event_id,
            user_id: util.generateUuid(),
            comment_id: util.generateUuid(),
            timestamp: util.getCurrrentTimestampSeconde(),
            message: body.message,
        },
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
    const eventFound = await dynamodb.getItem(buildParamsGet(eventId, TABLE_EVENTS));
    console.log(eventFound);
    if (Object.prototype.hasOwnProperty.call(eventFound, 'Item')) {
        return true;
    }
    return false;
}

module.exports.handler = async (event, context, callback) => {
    try {
        const body = JSON.parse(event.body);
        console.log('body', body); // Contains incoming request data (e.g., query params, headers and more)
        const eventExist = await checkEventExist(body.event_id);
        if (eventExist) {
            // we insert the event in the event and user event list
            // we insert the event in the event and user event list
            const newCommentCreated = await dynamodb.createItem(buildParams(event.body, TABLE_COMMENT));
            console.log('result', newCommentCreated);
            callback(null, util.buildResp(200, newCommentCreated));
            return;
        }
        callback(null, util.buildResp(404, `The event ${body.event_id} was not found`));
    } catch (err) {
        console.error(err);
        callback(null, util.buildResp(500, err));
    }
};
