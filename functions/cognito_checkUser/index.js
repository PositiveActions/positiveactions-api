const dynamodb = require('./utils/dynamodb');
const util = require('./utils/util');

const TABLE_USER = 'users-list';

function buildParams(email, tableName) {
    return {
        TableName: tableName,
        IndexName: 'user_email-index',
        KeyConditionExpression: '#email = :email',
        ExpressionAttributeNames: {
            '#email': 'email',
        },
        ExpressionAttributeValues: {
            ':email': email,
        },
    };
}

async function checkUserExist(userEmail) {
    const userFound = await dynamodb.queryItems(buildParams(userEmail, TABLE_USER));
    console.log('userFound', userFound);
    if (userFound.length) {
        return true;
    }
    return false;
}

module.exports.handler = async (event, context, callback) => {
    try {
        console.log('body', event); // Contains incoming request data (e.g., query params, headers and more)
        const { email } = { ...event.request.userAttributes };
        // we insert the event in the event and user event list
        const userExist = await checkUserExist(email);
        console.log('userExist', userExist);
        const resp = { ...event };
        resp.response = {
            autoConfirmUser: false,
        };
        console.log('resp', resp);
        if (!userExist) {
            callback(null, resp);
        } else {
            callback(new Error('This email address is already used'), resp);
        }
    } catch (err) {
        console.error(err);
        callback(util.buildResp(500, err));
    }
};
