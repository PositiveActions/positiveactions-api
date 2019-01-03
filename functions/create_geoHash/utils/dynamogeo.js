const ddbGeo = require('dynamodb-geo');
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB();
const TABLE_NAME = 'events-geo';
const RADIUS_METER = 100000;
const HASHKEY_LENGTH = 3;

// Configuration for a new instance of a GeoDataManager. Each GeoDataManager instance represents a table
const config = new ddbGeo.GeoDataManagerConfiguration(ddb, TABLE_NAME);

const myGeoTableManager = new ddbGeo.GeoDataManager(config);
// Pick a hashKeyLength appropriate to your usage
config.hashKeyLength = HASHKEY_LENGTH;

// Use GeoTableUtil to help construct a CreateTableInput.
const createTableInput = ddbGeo.GeoTableUtil.getCreateTableRequest(config);

function createGeoTable() {
    return ddb.createTable(createTableInput).promise()
        // Wait for it to become ready
        .then(() => ddb.waitFor('tableExists', { TableName: config.tableName }).promise())
        .then(() => { console.log('Table created and ready!'); });
}


async function addGeoPoint(rangeKey, lat, long, itemBody) {
    const params = {
        RangeKeyValue: { S: rangeKey }, // Use this to ensure uniqueness of the hash/range pairs.
        GeoPoint: { // An object specifying latitutde and longitude as plain numbers. Used to build the geohash, the hashkey and geojson data
            latitude: lat,
            longitude: long,
        },
    };
    if (itemBody) {
        params.PutItemInput = {
            Item: itemBody,
        };
    }
    return myGeoTableManager.putPoint(params).promise();
}

async function deleteGeoPoint(rangeKey, lat, long) {
    return myGeoTableManager.deletePoint({
        RangeKeyValue: { S: rangeKey }, // Use this to ensure uniqueness of the hash/range pairs.
        GeoPoint: { // An object specifying latitutde and longitude as plain numbers. Used to build the geohash, the hashkey and geojson data
            latitude: lat,
            longitude: long,
        },
    }).promise();
}

function updateGeoPoint(userId, latPrev, longPrev, newLat, newLong) {
    return deleteGeoPoint(userId, latPrev, longPrev).then(() => addGeoPoint(userId, newLat, newLong));
}

async function queryByRadius(lat, long) {
    return myGeoTableManager.queryRadius({
        RadiusInMeter: RADIUS_METER,
        CenterPoint: {
            latitude: lat,
            longitude: long,
        },
    });
}

module.exports = {
    createGeoTable,
    myGeoTableManager,
    addGeoPoint,
    deleteGeoPoint,
    updateGeoPoint,
    queryByRadius,
};
