document.getElementById('fileInput').addEventListener('change', handleFileUpload);

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    showLoading();
    try {
        const data = await parseJSONFile(file);
        const analyzedData = analyzeDataStructure(data);
        generateVisualizations(analyzedData);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function parseJSONFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                resolve(JSON.parse(e.target.result));
            } catch {
                reject(new Error('Invalid JSON format'));
            }
        };
        reader.onerror = () => reject(new Error('Error reading file'));
        reader.readAsText(file);
    });
}

function generateVisualizations({ data, analysis }) {
    const container = document.getElementById('chartContainer');
    container.innerHTML = '';

    analysis.numerical.forEach(field => {
        if (analysis.temporal.length > 0) {
            createLineChart(data, analysis.temporal[0], field);
        } else {
            createHistogram(data, field);
        }
    });

    analysis.categorical.forEach(field => {
        if (analysis.numerical.length > 0) {
            createBarChart(data, field, analysis.numerical[0]);
        } else {
            createPieChart(data, field);
        }
    });

    analysis.relationships.forEach(pair => {
        createScatterPlot(data, pair.x, pair.y);
    });
}

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.style.display = 'block';
    errorDiv.textContent = `Error: ${message}`;
    setTimeout(() => errorDiv.style.display = 'none', 5000);
}