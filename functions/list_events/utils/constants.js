const DISTANCE_RANGE = '100km';

// obj is an object with attribute lat, lon, category and date
const queryByLocTimeDate = (obj) => {
    const query = {
        from: 0,
        size: 1000,
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
    };
    if (obj.category !== 'all') {
        query.query.bool.filter.push({
            term: { category: obj.category },
        });
    }
    return query;
};

module.exports = {
    queryByLocTimeDate,
    EVENTS_INDEX: 'event_index',
    EVENTS_INDEX_TYPE: 'event',
};
