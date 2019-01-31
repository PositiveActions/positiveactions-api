module.exports = {
    EVENTS_INDEX: 'event_index',
    EVENTS_INDEX_TYPE: 'event',
    EVENTS_MAPPING: {
        properties: {
            location: {
                type: 'geo_point',
            },
            timestamp: {
                type: 'date',
                format: 'epoch_second',
            },
        },
    },
};
