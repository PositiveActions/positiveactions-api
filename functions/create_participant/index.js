const dynamodb = require('./utils/dynamodb');
const util = require('./utils/util');

const TABLE_PARTICIPANT = 'events-participants';
const TABLE_EVENTS = 'events-list';

function buildParamsPost(body, tableName) {
    return {
        TableName: tableName,
        Item: {
            event_id: body.event_id,
            user_id: util.generateUuid(),
            timestamp: util.getCurrrentTimestampSeconde(),
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
        console.log('body', event.body); // Contains incoming request data (e.g., query params, headers and more)
        const body = JSON.parse(event.body);
        const eventExist = await checkEventExist(body.event_id);
        if (eventExist) {
            // we insert the event in the event and user event list
            const newParticipant = await dynamodb.createItem(buildParamsPost(body, TABLE_PARTICIPANT));
            console.log('result', newParticipant);
            callback(null, util.buildResp(200, newParticipant));
            return;
        }
        callback(null, util.buildResp(404, `The event ${body.event_id} was not found`));
    } catch (err) {
        console.error(err);
        callback(null, util.buildResp(500, err));
    }
};
