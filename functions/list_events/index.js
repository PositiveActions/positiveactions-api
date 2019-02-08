const elasticUtils = require('./utils/elastic_utils');
const Constants = require('./utils/constants');
const util = require('./utils/util');

module.exports.handler = async (event, context, callback) => {
    try {
        console.log(event); // Contains incoming request data (e.g., query params, headers and more)
        const result = await elasticUtils.search(Constants.EVENTS_INDEX, Constants.EVENTS_INDEX_TYPE, Constants.queryByLocTimeDate({
            category: event.queryStringParameters.category,
            lat: event.queryStringParameters.lat,
            lon: event.queryStringParameters.lon,
            sdate: event.queryStringParameters.sdate,
            edate: event.queryStringParameters.edate,
        }));
        console.log('result', result);
        if (result.hits.total) {
            callback(null, util.buidResp(200, result.hits.hits.map(one => one._source)));
            return;
        }
        callback(null, util.buidResp(200, []));
    } catch (err) {
        console.error(err);
        callback(null, util.buidResp(500, err));
    }
};
