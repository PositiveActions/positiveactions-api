const dynamodb = require('./utils/dynamodb');
const util = require('./utils/util');

const TABLE_EVENTS = 'users-events';
const TABLE_USER = 'users-list';

function buildParams(userId, tableName) {
    return {
        TableName: tableName,
        KeyConditionExpression: '#user_id = :user_id',
        ExpressionAttributeNames: {
            '#user_id': 'user_id',
        },
        ExpressionAttributeValues: {
            ':user_id': userId,
        },
        //  get the latest data
        ScanIndexForward: false,
    };
}


function buildParamsGet(userId, tableName) {
    return {
        TableName: tableName,
        Key: {
            user_id: userId,
        },
    };
}


async function getUser(userId) {
    const userFound = await dynamodb.getItem(buildParamsGet(userId, TABLE_USER));
    console.log(userFound);
    if (Object.prototype.hasOwnProperty.call(userFound, 'Item')) {
        return userFound.Item;
    }
    return null;
}

module.exports.handler = async (event, context, callback) => {
    try {
        const { userId } = { ...event.queryStringParameters };
        console.log('userId', userId); // Contains incoming request data (e.g., query params, headers and more)
        const userFound = await getUser(userId);
        if (userFound) {
            const eventsFound = await dynamodb.queryItems(buildParams(userId, TABLE_EVENTS));
            console.log('eventsFound', eventsFound);
            callback(null, util.buildResp(200, { user: userFound, events: eventsFound }));
            return;
        }
        callback(null, util.buildResp(404, `The user ${userId} was not found`));
    } catch (err) {
        console.error(err);
        callback(null, util.buildResp(500, err));
    }
};
