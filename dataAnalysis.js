function analyzeDataStructure(data) {
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error('JSON should be a non-empty array of objects');
    }

    const sampleItem = data[0];
    const analysis = { 
        numerical: [],
        categorical: [],
        temporal: [],
        geographical: [],
        relationships: []
    };

    Object.keys(sampleItem).forEach(key => {
        const value = sampleItem[key];
        const type = typeof value;

        if (type === 'number') {
            analysis.numerical.push(key);
        } else if (type === 'string') {
            if (!isNaN(Date.parse(value))) {
                analysis.temporal.push(key);
            } else if (isGeographicalKey(key)) {
                analysis.geographical.push(key);
            } else {
                analysis.categorical.push(key);
            }
        }
    });

    if (analysis.numerical.length >= 2) {
        analysis.relationships.push({
            x: analysis.numerical[0],
            y: analysis.numerical[1]
        });
    }

    return { data, analysis };
}

function isGeographicalKey(key) {
    const geoKeywords = ['country', 'state', 'city', 'latitude', 'longitude'];
    return geoKeywords.some(geoWord => key.toLowerCase().includes(geoWord));
}