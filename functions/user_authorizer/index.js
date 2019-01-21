const dynamodb = require('./utils/dynamodb');

function buildParams() {
    return {
        TableName: 'unausers-apikeys',
        IndexName: 'apiKey-index',
        KeyConditionExpression: '#apiKey = :apiKey',
        ExpressionAttributeNames: {
            '#apiKey': 'apiKey',
        },
        ExpressionAttributeValues: {
            ':apiKey': 'apiKey',
        },
        // only need one since
        Limit: 1,
    };
}

// A function to generate a response from Authorizer to API Gateway.
function generatePolicy(principalId, effect, resource) {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource,
            }],
        },
    };
}


module.exports.handler = async (event, context) => {
    console.log('[UnaCloud-api-authorizer] event', event);
    try {
        const [user] = dynamodb.queryItems(buildParams(event.headers['x-api-key']));
        if (user) {
            context.succeed(generatePolicy(user.user_id, 'Allow', event.methodArn));
        } else {
            context.fail('User was not found');
        }
    } catch (err) {
        console.error(err);
        context.fail('User was not found');
    }
};
