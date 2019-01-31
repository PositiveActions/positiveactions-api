const elastic = require('./utils/elastic_utils');
const Constants = require('./utils/constants');
const dynamodb = require('./utils/dynamodb');


module.exports.handler = async (event, context, callback) => {

    try {
        console.log('event', event);
        const data = dynamodb.getTheInsertAndDynamoData(event.Records);
        console.log('data unmarshall', data);
        const indexExist = await elastic.indexExist(Constants.EVENTS_INDEX);
        if (!indexExist) {
            await elastic.createIndex(Constants.EVENTS_INDEX);
            await elastic.initMapping(Constants.EVENTS_INDEX, Constants.EVENTS_INDEX_TYPE, Constants.EVENTS_MAPPING);
        }
        if (data.length) {
            const res = await elastic.bulk(elastic.buildBulkBody('index', Constants.EVENTS_INDEX, Constants.EVENTS_INDEX_TYPE, data));
            console.log(res);
        }
        callback(null, 'success bro');
    } catch (err) {
        console.error(err);
        callback(err);
    }
};
