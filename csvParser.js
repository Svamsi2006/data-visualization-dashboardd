function parseCSVFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Error reading CSV file'));
        reader.readAsText(file);
    });
}

function convertCSVtoJSON(csv) {
    const lines = csv.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        return headers.reduce((obj, header, index) => {
            let value = values[index]?.trim().replace(/^"(.*)"$/, '$1') || '';
            obj[header] = !isNaN(value) && value !== '' ? Number(value) : value;
            
            // Try to parse dates
            if (typeof obj[header] === 'string' && !isNaN(Date.parse(obj[header]))) {
                obj[header] = new Date(obj[header]).toISOString();
            }
            
            return obj;
        }, {});
    }).filter(row => Object.values(row).some(v => v !== ''));
}