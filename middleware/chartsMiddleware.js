const { JSDOM } = require('jsdom');
const d3nLine = require('d3node-linechart');
const output = require('d3node-output');

const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const lineChart_ExpensesByDate = async (data, userId) => {
    
    const width = 600;
    const height = 400;
    const backgroundColor = 'white';

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0'); // Get day with leading zero
        const monthOptions = { month: 'short' }; // Short month name
        const month = date.toLocaleDateString('en-US', monthOptions).slice(0, 3); // Get first three letters of the month
        const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year

        return `${day} ${month}. ${year}`;
    };

    const canvasRenderService = new ChartJSNodeCanvas({width, height, backgroundColor});

    const numberOfEntries = Math.min(data.length, 6);
    data = data.slice(-numberOfEntries);

    let labels = [];
    for (const d of data) {
        labels.push(formatDate(d.date));
    }

    let priceData = [];
    for (const d of data) {
        priceData.push(d.total);
    }

    const config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Recent expenses",
                data: priceData,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.4, // Slightly more curvature for a modern look
                borderWidth: 3, // Thicker line for better visibility
                pointRadius: 6, // Slightly larger points
                pointHoverRadius: 8, // Larger on hover
                pointBackgroundColor: 'white', // Background color for points
                pointBorderColor: 'rgb(75, 192, 192)',
            }]
        },
        options: {
            responsive: true, // Makes the chart responsive
            maintainAspectRatio: false, // Allows customization of width/height
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false // Hide grid lines on the x-axis
                    },
                    title: {
                        display: true,
                        text: 'Date', // Title for x-axis
                        padding: {
                            top: 10,
                            bottom: 10
                        },
                        color: 'rgb(75, 192, 192)', // Title color
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        color: 'rgb(120, 120, 120)', // Tick color
                        font: {
                            size: 12
                        }
                    }
                    
                },
                y: {
                    display: true,
                    grid: {
                        color: 'rgba(75, 192, 192, 0.1)', // Light grid color for y-axis
                        lineWidth: 1
                    },
                    title: {
                        display: true,
                        text: 'Expenses', // Title for y-axis
                        padding: {
                            top: 10,
                            bottom: 10
                        },
                        color: 'rgb(75, 192, 192)', // Title color
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        color: 'rgb(120, 120, 120)', // Tick color
                        font: {
                            size: 12
                        },
                        callback: (value) => `$${value}`, // Format y-axis ticks as currency
                    },
                    suggestedMin: 0, // Optional: set minimum y-axis value
                    suggestedMax: Math.max(...priceData) + 10 // Optional: set a max y-axis value based on data
                }
            },
            plugins: {
                legend: {
                    display: true, // Show legend
                    position: 'top', // Position of the legend
                    labels: {
                        color: 'rgb(75, 192, 192)', // Legend text color
                        font: {
                            size: 14
                        }
                    }
                },
                afterDraw: function(chart) {
                    const ctx = chart.ctx;
                    const dataset = chart.data.datasets[0];
                    const points = chart.getElementsAtEventForMode(chart.chartArea, 'nearest', { intersect: true }, false);
        
                    ctx.save();
                    ctx.fillStyle = 'rgb(75, 192, 192)'; // Text color
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
        
                    points.forEach(point => {
                        const index = point.index;
                        const value = dataset.data[index];
                        const { x, y } = point;
        
                        ctx.fillText(`$${value.toFixed(2)}`, x, y + 5); // Positioning the text below the point
                    });
        
                    ctx.restore();
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Tooltip background color
                    titleColor: 'rgb(75, 192, 192)', // Tooltip title color
                    bodyColor: 'rgb(75, 192, 192)', // Tooltip body color
                    borderColor: 'rgb(75, 192, 192)', // Border color
                    borderWidth: 1,
                    callbacks: {
                        title: (tooltipItems) => {
                            // Display the formatted date for the tooltip title
                            return tooltipItems[0].label; // The label already contains the formatted date
                        },
                        label: (tooltipItem) => {
                            // Display the total expenses for that date
                            const expenses = tooltipItem.raw;
                            return `Total: $${expenses.toFixed(2)}`; // Format expenses as currency
                        },
                    }
                }
            },
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20 // Add padding around the chart
                }
            }
        }
    };

    const dataUrl = await canvasRenderService.renderToDataURL(config);
    return dataUrl;
}

const lineChart_ExpensesComplete = async (data) => {
    const width = 600;
    const height = 400;
    const backgroundColor = 'white';

    const canvasRenderService = new ChartJSNodeCanvas({width, height, backgroundColor});

    let labels = [];
    for (const d of data) {
        labels.push(d.date);
    }

    let priceData = [];
    for (const d of data) {
        priceData.push(d.total);
    }

    const config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Expenses History",
                data: priceData,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: 'white',
                pointBorderColor: 'rgb(75, 192, 192)',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'X', // Updated to "X"
                        padding: {
                            top: 10,
                            bottom: 10
                        },
                        color: 'rgb(75, 192, 192)',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        display: false
                    }
                },
                y: {
                    display: true,
                    grid: {
                        color: 'rgba(75, 192, 192, 0.1)',
                        lineWidth: 1
                    },
                    title: {
                        display: true,
                        text: 'Y', // Updated to "Y"
                        padding: {
                            top: 10,
                            bottom: 10
                        },
                        color: 'rgb(75, 192, 192)',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        color: 'rgb(120, 120, 120)',
                        font: {
                            size: 12
                        },
                        callback: (value) => `$${value}`,
                    },
                    suggestedMin: 0,
                    suggestedMax: Math.max(...priceData) + 10
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: 'rgb(75, 192, 192)',
                        font: {
                            size: 14
                        }
                    }
                },
                afterDraw: function(chart) {
                    const ctx = chart.ctx;
                    const dataset = chart.data.datasets[0];
                    const points = chart.getElementsAtEventForMode(chart.chartArea, 'nearest', { intersect: true }, false);
            
                    ctx.save();
                    ctx.fillStyle = 'rgb(75, 192, 192)';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
            
                    points.forEach(point => {
                        const index = point.index;
                        const value = dataset.data[index];
                        const { x, y } = point;
            
                        ctx.fillText(`$${value.toFixed(2)}`, x, y + 5);
                    });
            
                    ctx.restore();
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: 'rgb(75, 192, 192)',
                    bodyColor: 'rgb(75, 192, 192)',
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1,
                    callbacks: {
                        title: (tooltipItems) => {
                            return tooltipItems[0].label;
                        },
                        label: (tooltipItem) => {
                            const expenses = tooltipItem.raw;
                            return `Total: $${expenses.toFixed(2)}`;
                        },
                    }
                }
            },
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20
                }
            }
        }
    };    

    const dataUrl = await canvasRenderService.renderToDataURL(config);
    return dataUrl;
}

module.exports = {
    lineChart_ExpensesByDate,
    lineChart_ExpensesComplete
}