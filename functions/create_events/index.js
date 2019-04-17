const dynamodb = require('./utils/dynamodb');
const util = require('./utils/util');
const imgHelper = require('./utils/imgHelper');

const TABLE_EVENTLIST = 'events-list';
// const TABLE_USEREVENT = 'users-events';


async function buildParams(bodyRaw, tableName) {
    const body = JSON.parse(bodyRaw);
    const eventId = util.generateUuid();
    // we receive the name of the image uploaded;
    const img = await imgHelper.uploadImg(eventId, body.img);
    return {
        TableName: tableName,
        Item: {
            event_id: eventId,
            timestamp: util.getCurrrentTimestampSeconde(),
            description: body.description,
            title: body.title,
            location_name: body.location_name,
            location: {
                lat: body.lat,
                lon: body.lng,
            },
            fee: body.fee,
            author: body.author,
            category: body.category,
            sdate: body.sdate,
            contact: JSON.stringify(body.contact),
            img,
        },
    };
}

module.exports.handler = async (event, context, callback) => {
    try {
        console.log('body', event.body); // Contains incoming request data (e.g., query params, headers and more)
        const params = await buildParams(event.body, TABLE_EVENTLIST);
        // we insert the event in the event and user event list
        const [newEventCreated] = await Promise.all([dynamodb.createItem(params)]);
        console.log('result', newEventCreated);
        callback(null, util.buildResp(200, newEventCreated));
    } catch (err) {
        console.error(err);
        callback(null, util.buildResp(500, err));
    }
};
