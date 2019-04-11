const dynamodb = require('./utils/dynamodb');
const util = require('./utils/util');

const TABLE_CATEGORY = 'category-list';

function buildParams() {
    return {
        TableName: TABLE_CATEGORY,
    };
}

module.exports.handler = async (event, context, callback) => {
    try {
        const categories = await dynamodb.scanTable(buildParams());
        callback(null, util.buildResp(200, categories));
    } catch (err) {
        console.error(err);
        callback(util.buildResp(500, err));
    }
};
