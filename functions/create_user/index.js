const dynamodb = require('./utils/dynamodb');
const util = require('./utils/util');

function buildParams(body) {
    return {
        TableName: 'events',
        Item: {
            event_id: util.generateUuid(),
            timestamp: body.timestamp,
            description: body.description,
            title: body.title,
            location: body.location,
            fee: body.fee,
        },
    };
}


module.exports.handler = async (event, context, callback) => {
    try {
        console.log(event.body); // Contains incoming request data (e.g., query params, headers and more)
        const result = await dynamodb.createItem(buildParams(event.body));
        console.log('result', result);
        callback(null, 'response');
    } catch (err) {
        console.error(err);
    }
};
