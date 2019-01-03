const dynamodb = require('./utils/dynamogeo');

module.exports.handler = async (event, context, callback) => {
    try {
        console.log(event.body); // Contains incoming request data (e.g., query params, headers and more)
        callback(null, 'response');
    } catch (err) {
        console.error(err);
        callback(err);
    }
};
