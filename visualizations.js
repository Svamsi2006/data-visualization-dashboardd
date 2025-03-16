// Helper function to create chart containers
function createHistogram(data, field) {
    try {
        const trace = {
            x: data.map(d => d[field]),
            type: 'histogram',
            marker: { 
                color: '#00f3ff',
                line: { color: '#ffffff', width: 1 }
            }
        };

        const layout = {
            title: `${field} Distribution`,
            xaxis: { title: field },
            yaxis: { title: 'Frequency' },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#fff' },
            bargap: 0.1
        };

        return createChartContainer([trace], layout);
    } catch (error) {
        console.error('Error creating histogram:', error);
        throw error;
    }
}

// Also add the missing scatter plot function
function createScatterPlot(data, xField, yField) {
    try {
        const trace = {
            x: data.map(d => d[xField]),
            y: data.map(d => d[yField]),
            mode: 'markers',
            marker: {
                color: '#ff4081',
                size: 12,
                line: { color: '#ffffff', width: 1 }
            }
        };

        const layout = {
            title: `${yField} vs ${xField}`,
            xaxis: { title: xField },
            yaxis: { title: yField },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#fff' }
        };

        return createChartContainer([trace], layout);
    } catch (error) {
        console.error('Error creating scatter plot:', error);
        throw error;
    }
}
function createChartContainer(traces, layout) {
    try {
        const div = document.createElement('div');
        div.className = 'chart-box';
        
        // Store original data for zoom functionality
        div._plotlyData = { traces, layout };
        
        document.getElementById('chartContainer').appendChild(div);
        Plotly.newPlot(div, traces, layout);
        return div;
    } catch (error) {
        console.error('Error creating chart container:', error);
        throw error;
    }
}

// Line Chart with date validation
function createLineChart(data, xField, yField) {
    try {
        const xValues = data.map(d => {
            const date = new Date(d[xField]);
            return isNaN(date) ? d[xField] : date; // Handle invalid dates
        });

        const trace = {
            x: xValues,
            y: data.map(d => d[yField]),
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: '#00f3ff', width: 2 },
            marker: { size: 8 },
            hovertemplate: '%{x|%b %d, %Y}<br>%{y}<extra></extra>'
        };

        const layout = {
            title: `${yField} Over Time`,
            xaxis: { title: xField, type: 'date' },
            yaxis: { title: yField },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#fff' },
            margin: { t: 40, b: 40, l: 60, r: 40 }
        };

        return createChartContainer([trace], layout);
    } catch (error) {
        console.error('Error creating line chart:', error);
        throw error;
    }
}

// Bar Chart with value validation
function createBarChart(data, categoryField, valueField) {
    try {
        const categories = [...new Set(data.map(d => d[categoryField]))];
        const values = categories.map(cat => 
            data.filter(d => d[categoryField] === cat)
                .reduce((sum, d) => sum + (Number(d[valueField]) || 0), 0)
        );

        const trace = {
            x: categories,
            y: values,
            type: 'bar',
            marker: { 
                color: '#7c4dff',
                line: { width: 2, color: '#ffffff' }
            },
            text: values.map(v => v.toLocaleString()),
            textposition: 'auto'
        };

        const layout = {
            title: `${valueField} by ${categoryField}`,
            xaxis: { title: categoryField },
            yaxis: { title: valueField },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#fff' },
            margin: { t: 40, b: 80, l: 60, r: 40 }
        };

        return createChartContainer([trace], layout);
    } catch (error) {
        console.error('Error creating bar chart:', error);
        throw error;
    }
}

// Pie Chart with improved labels
function createPieChart(data, field) {
    try {
        const counts = data.reduce((acc, item) => {
            const val = item[field]?.toString() || 'Unknown';
            acc[val] = (acc[val] || 0) + 1;
            return acc;
        }, {});

        const trace = {
            values: Object.values(counts),
            labels: Object.keys(counts),
            type: 'pie',
            hole: 0.4,
            marker: { 
                colors: Plotly.d3.scale.category10().range() // Use color scale
            },
            textinfo: 'percent+label',
            insidetextorientation: 'radial',
            hoverinfo: 'label+percent+value'
        };

        const layout = {
            title: `${field} Distribution`,
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#fff' },
            showlegend: false,
            margin: { t: 40, b: 20, l: 20, r: 20 }
        };

        return createChartContainer([trace], layout);
    } catch (error) {
        console.error('Error creating pie chart:', error);
        throw error;
    }
}