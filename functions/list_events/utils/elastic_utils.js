const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
    host: process.env.ELASTICSEARCH_HOST,
    log: 'trace',
    apiVersion: '6.2',
});

function createItem(index, payload) {
    return new Promise((resolve, reject) => {
        client.create({
            index,

            body: payload,
        }, (err, resp) => {
            if (err) {
                reject(err);
            } else {
                resolve(resp);
            }
        });
    });
}

function bulk(body) {
    return new Promise((resolve, reject) => {
        console.log('bulk body', body);
        client.bulk({
            body,
        }, (err, resp) => {
            if (err) {
                reject(err);
            } else {
                resolve(resp);
            }
        });
    });
}

function createIndex(indexName) {
    return client.indices.create({
        index: indexName,
    });
}

function indexExist(indexName) {
    return client.indices.exists({
        index: indexName,
    });
}

async function ping() {
    return new Promise((resolve, reject) => {
        client.ping({
            requestTimeout: 30000,
        }, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve('All is well');
            }
        });
    });
}

function search(indexName, typeName, payload) {
    return client.search({
        index: indexName,
        type: typeName,
        body: payload,
    });
}


module.exports = {
    search,
    createItem,
    createIndex,
    indexExist,
    ping,
    bulk,
};
