document.getElementById('fileInput').addEventListener('change', handleFileUpload);

// Sample data structure for testing
const sampleData = [
    { category: 'A', value: 30, date: '2023-01-01', region: 'North' },
    { category: 'B', value: 45, date: '2023-01-02', region: 'South' },
    { category: 'C', value: 25, date: '2023-01-03', region: 'East' }
];

// Initialize with sample data
generateDashboard(sampleData);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    showLoading();
    try {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = JSON.parse(e.target.result);
            generateDashboard(data);
            hideLoading();
        };
        reader.readAsText(file);
    } catch (error) {
        showError(error.message);
        hideLoading();
    }
}

function generateDashboard(data) {
    const container = document.getElementById('chartContainer');
    container.innerHTML = '';

    // Line Chart
    createLineChart(data, 'date', 'value');
    
    // Bar Chart
    createBarChart(data, 'category', 'value');
    
    // Pie Chart
    createPieChart(data, 'category');
    
    // Scatter Plot
    createScatterPlot(data, 'value', 'category');
}

function createLineChart(data, xField, yField) {
    const trace = {
        x: data.map(d => d[xField]),
        y: data.map(d => d[yField]),
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: '#00f3ff' }
    };

    const layout = {
        title: `${yField} Over Time`,
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#fff' }
    };

    createChartContainer([trace], layout);
}

function createBarChart(data, xField, yField) {
    const trace = {
        x: data.map(d => d[xField]),
        y: data.map(d => d[yField]),
        type: 'bar',
        marker: { color: '#7c4dff' }
    };

    const layout = {
        title: `${yField} by ${xField}`,
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#fff' }
    };

    createChartContainer([trace], layout);
}

function createPieChart(data, field) {
    const counts = data.reduce((acc, item) => {
        acc[item[field]] = (acc[item[field]] || 0) + 1;
        return acc;
    }, {});

    const trace = {
        values: Object.values(counts),
        labels: Object.keys(counts),
        type: 'pie',
        marker: { colors: ['#00f3ff', '#7c4dff', '#ff4081'] }
    };

    const layout = {
        title: `${field} Distribution`,
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#fff' }
    };

    createChartContainer([trace], layout);
}

function createScatterPlot(data, xField, yField) {
    const trace = {
        x: data.map(d => d[xField]),
        y: data.map(d => d[yField]),
        mode: 'markers',
        marker: { color: '#ff4081', size: 12 }
    };

    const layout = {
        title: `${yField} vs ${xField}`,
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#fff' }
    };

    createChartContainer([trace], layout);
}

function createChartContainer(traces, layout) {
    const div = document.createElement('div');
    div.className = 'chart-box';
    document.getElementById('chartContainer').appendChild(div);
    Plotly.newPlot(div, traces, layout);
}

// Helper functions
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