// const AWS = require('aws-sdk');

//* / get reference to S3 client
// const s3 = new AWS.S3();
const bucketName = 'positiveactions-img';

module.exports.handler = (event, context, callback) => {
    const url = `https://${bucketName}.s3.amazonaws.com/${event.queryStringParameters.key}`;
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            url,
        }),
    };
    console.log('response', response);
    callback(null, response);
    // const params = {
    //     Bucket: bucketName,
    //     Key: event.queryStringParameters.key,
    // };
    // s3.getObject(params, (err, data) => {
    //     if (err) {
    //         callback(err, null);
    //     } else {
    //         const response = {
    //             statusCode: 200,
    //             body: JSON.stringify(data),
    //             isBase64Encoded: false,
    //         };
    //         callback(null, response);
    //     }
    // });
};
