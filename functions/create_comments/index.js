const dynamodb = require('./utils/dynamodb');
const util = require('./utils/util');

const TABLE_COMMENT = 'events-comments';
const TABLE_EVENTS = 'events-list';
const TABLE_USERS = 'users-list';

function buildParams(bodyRaw, user, tableName) {
    const body = JSON.parse(bodyRaw);
    return {
        TableName: tableName,
        Item: {
            event_id: body.event_id,
            user_id: user.user_id,
            username: user.username,
            comment_id: util.generateUuid(),
            timestamp: util.getCurrrentTimestampSeconde(),
            message: body.message,
        },
    };
}

function buildParamsGetEvent(eventId, tableName) {
    return {
        TableName: tableName,
        Key: {
            event_id: eventId,
        },
    };
}

function buildParamsGetUser(userId, tableName) {
    return {
        TableName: tableName,
        Key: {
            user_id: userId,
        },
    };
}


async function checkEventExist(eventId) {
    const eventFound = await dynamodb.getItem(buildParamsGetEvent(eventId, TABLE_EVENTS));
    console.log(eventFound);
    if (Object.prototype.hasOwnProperty.call(eventFound, 'Item')) {
        return true;
    }
    return false;
}


async function checkUserExist(userId) {
    const userFound = await dynamodb.getItem(buildParamsGetUser(userId, TABLE_USERS));
    console.log(userFound);
    if (Object.prototype.hasOwnProperty.call(userFound, 'Item')) {
        return userFound.Item;
    }
    return null;
}

module.exports.handler = async (event, context, callback) => {
    try {
        const body = JSON.parse(event.body);
        console.log('body', body); // Contains incoming request data (e.g., query params, headers and more)
        const [eventExist, user] = await Promise.all([checkEventExist(body.event_id), checkUserExist(body.user_id)]);
        if (eventExist && user) {
            // we insert the event in the event and user event list
            // we insert the event in the event and user event list
            const newCommentCreated = await dynamodb.createItem(buildParams(event.body, user, TABLE_COMMENT));
            console.log('result', newCommentCreated);
            callback(null, util.buildResp(200, newCommentCreated));
            return;
        }
        callback(null, util.buildResp(404, `The event ${body.event_id} or user was not found`));
    } catch (err) {
        console.error(err);
        callback(null, util.buildResp(500, err));
    }
};
