const aws = require('aws-sdk');

const docClient = new aws.DynamoDB.DocumentClient();

function createItem(params) {
    return new Promise((resolve, reject) => {
        console.log('params', params);
        docClient.put(params, (err) => {
            if (err) {
                reject(err);
                return;
            }
            // return the item inserted
            resolve(params.Item);
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
