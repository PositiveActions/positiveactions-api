const aws = require('aws-sdk');

const docClient = new aws.DynamoDB.DocumentClient();

function createItem(params) {
    return new Promise((resolve, reject) => {
        docClient.put(params, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}

function queryItems() {

}

function getItem() {

}

function deleteItem() {

}

function batchDelete() {

}

module.exports = {
    getItem,
    deleteItem,
    batchDelete,
    queryItems,
    createItem,
};
