const dynamodb = require('./utils/dynamodb');
const util = require('./utils/util');

function buildParams(body) {
    return {
        TableName: 'events',
        Item: {
            category: body.category,
            location: body.location,
            date: body.timestamp,
        },
    };
}


module.exports.handler = async (event, context, callback) => {
    try {
        console.log(event.body); // Contains incoming request data (e.g., query params, headers and more)
        const result = await dynamodb.queryItems(buildParams(event.body));
        console.log('result', result);
        callback(null, 'response');
    } catch (err) {
        console.error(err);
    }
};
