const aws = require('aws-sdk');

const dynamodbConverter = aws.DynamoDB.Converter;


function getTheInsertAndDynamoData(event) {
    //  we take only the insert data
    return event.filter(one => one.eventName === 'INSERT').map(one => dynamodbConverter.unmarshall(one.dynamodb.NewImage));
}

module.exports = {
    getTheInsertAndDynamoData,
};
