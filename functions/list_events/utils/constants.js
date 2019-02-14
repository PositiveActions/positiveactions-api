const DISTANCE_RANGE = '100km';

// obj is an object with attribute lat, lon, category and date
const queryByLocTimeDate = obj => ({
    query: {
        bool: {
            must: {
                match_all: {},
            },
            filter: [
                {
                    geo_distance: {
                        distance: DISTANCE_RANGE,
                        location: {
                            lat: obj.lat,
                            lon: obj.lon,
                        },
                    },
                },
                {
                    term: { category: obj.category },
                },
                {
                    range: {
                        sdate: {
                            gte: obj.sdate,
                            lte: obj.edate,
                        },
                    },
                },
            ],
        },
    },
});

module.exports = {
    queryByLocTimeDate,
    EVENTS_INDEX: 'event_index',
    EVENTS_INDEX_TYPE: 'event',
};
