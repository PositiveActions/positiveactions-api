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

function queryItems(params) {
    return new Promise((resolve, reject) => {
        docClient.query(params, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            if (data.Count > 0) {
                resolve(data.Items);
            } else {
                resolve([]);
            }
        });
    });
}

function getItem(params) {
    return new Promise((resolve, reject) => {
        docClient.get(params, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
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
