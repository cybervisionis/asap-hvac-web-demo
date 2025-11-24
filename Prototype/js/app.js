// ASAP HVAC Prototype App

let appData = {};

// Load data
async function loadData() {
    try {
        const response = await fetch('data/data.json');
        appData = await response.json();
        console.log('Data loaded:', appData);
        return appData;
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

// Render services on home page
function renderServices() {
    const grid = document.getElementById('services-grid');
    if (!grid || !appData.services) return;
    
    const services = appData.services.slice(0, 3);
    grid.innerHTML = services.map(service => 
        `<div class="card">
            <h3>${service.name}</h3>
            <p class="card-price">${service.basePriceRange}</p>
            <p>${service.description}</p>
        </div>`
    ).join('');
}

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    renderServices();
});

// Helper to save quote request
function saveQuoteRequest(quoteData) {
    const quotes = JSON.parse(localStorage.getItem('quoteRequests') || '[]');
    quotes.push(quoteData);
    localStorage.setItem('quoteRequests', JSON.stringify(quotes));
    return quoteData;
}

// Helper to get quote requests
function getQuoteRequests() {
    return JSON.parse(localStorage.getItem('quoteRequests') || '[]');
}
