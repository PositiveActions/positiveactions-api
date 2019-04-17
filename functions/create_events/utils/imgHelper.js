
// eslint-disable-next-line import/no-unresolved
const AWS = require('aws-sdk');

const s3 = new AWS.S3();


const bucketName = 'positiveactions-img';

function _buildFileName(eventId) {
    return `pa_img_${eventId}.png`;
}
function uploadImg(eventId, encodedImage) {
    if (!encodedImage) {
        return Promise.resolve('default.png');
    }
    return new Promise((resolve) => {
        const decodedImage = Buffer.from(encodedImage, 'base64');
        const filePath = _buildFileName(eventId);
        const params = {
            Body: decodedImage,
            Bucket: bucketName,
            Key: filePath,
        };
        s3.upload(params, (err) => {
            if (err) {
                console.error(err);
                resolve('default.png');
            } else {
                resolve(filePath);
            }
        });
    });
}

module.exports = {
    uploadImg,
};
