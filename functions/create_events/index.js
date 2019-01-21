const dynamodb = require('./utils/dynamodb');
const util = require('./utils/util');

const TABLE_EVENTLIST = 'events-list';
// const TABLE_USEREVENT = 'users-events';

function buildParams(bodyRaw, tableName) {
    const body = JSON.parse(bodyRaw);
    return {
        TableName: tableName,
        Item: {
            event_id: util.generateUuid(),
            timestamp: parseInt(body.timestamp, 10),
            description: body.description,
            title: body.title,
            location: body.location,
            fee: body.fee,
            author: body.author,
            category: body.category,
        },
    };
}


module.exports.handler = async (event, context, callback) => {
    try {
        console.log('body', event.body); // Contains incoming request data (e.g., query params, headers and more)
        // we insert the event in the event and user event list
        const [newEventCreated] = await Promise.all([dynamodb.createItem(buildParams(event.body, TABLE_EVENTLIST))]);
        console.log('result', newEventCreated);
        callback(null, util.buidResp(200, newEventCreated));
    } catch (err) {
        console.error(err);
        callback(util.buildResp(500, err));
    }
};
