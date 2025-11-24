// ASAP HVAC Prototype App

let appData = {};

const serviceVisuals = {
    'svc-diagnostic': {
        tag: 'EMERGENCY',
        image: 'https://images.pexels.com/photos/8291707/pexels-photo-8291707.jpeg?auto=compress&cs=tinysrgb&w=1600',
        highlights: ['Same-day troubleshooting', 'Fee credited to repair', 'Licensed & insured techs']
    },
    'svc-tuneup': {
        tag: 'MAINTENANCE',
        image: 'https://images.pexels.com/photos/8486932/pexels-photo-8486932.jpeg?auto=compress&cs=tinysrgb&w=1600',
        highlights: ['Two 21-point tune-ups', 'Coil rinse & drain flush', 'Filter & thermostat check']
    },
    'svc-install': {
        tag: 'INSTALL CREW',
        image: 'https://images.pexels.com/photos/8961699/pexels-photo-8961699.jpeg?auto=compress&cs=tinysrgb&w=1600',
        highlights: ['Load calculation', 'Manufacturer warranty support', 'Permit & inspection ready']
    },
    'svc-duct-repair': {
        tag: 'AIRFLOW',
        image: 'https://images.pexels.com/photos/8486978/pexels-photo-8486978.jpeg?auto=compress&cs=tinysrgb&w=1600',
        highlights: ['Seal leaks & gaps', 'Improve comfort balance', 'Flexible scheduling']
    },
    'svc-duct-replace': {
        tag: 'FULL REBUILD',
        image: 'https://images.pexels.com/photos/8487398/pexels-photo-8487398.jpeg?auto=compress&cs=tinysrgb&w=1600',
        highlights: ['Measure & map entire system', 'Insulated trunk & branches', 'Code-compliant materials']
    },
    'svc-thermostat': {
        tag: 'SMART UPGRADE',
        image: 'https://images.pexels.com/photos/3811584/pexels-photo-3811584.jpeg?auto=compress&cs=tinysrgb&w=1600',
        highlights: ['Device + install bundle', 'Wi-Fi + app setup', 'Usage coaching for savings']
    },
    'svc-plumbing-assist': {
        tag: 'PLUMBING',
        image: 'https://images.pexels.com/photos/8486975/pexels-photo-8486975.jpeg?auto=compress&cs=tinysrgb&w=1600',
        highlights: ['Licensed plumbing support', 'Condensate & drain fixes', 'Same-stop repair + HVAC']
    }
};

function buildServiceCardMarkup(service, { compact = false } = {}) {
    const visuals = serviceVisuals[service.id] || {};
    const features = visuals.highlights || [service.description];
    const imageStyle = visuals.image ? `style="background-image:url('${visuals.image}')"` : '';
    return `
        <div class="service-card${compact ? ' is-compact' : ''}">
            ${visuals.tag ? `<span class="service-tag">${visuals.tag}</span>` : ''}
            <div class="service-card__media" ${imageStyle}></div>
            <h3>${service.name}</h3>
            <div class="price-range">${service.basePriceRange}</div>
            <p class="description">${service.description}</p>
            <ul class="feature-list">
                ${features.map(item => `
                    <li>
                        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>${item}</span>
                    </li>
                `).join('')}
            </ul>
            <div class="actions">
                <a class="btn-quote" href="quote.html?service=${service.id}">Request Quote</a>
                <a class="btn-outline-light" href="contact.html">Ask a Tech</a>
            </div>
        </div>
    `;
}

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
    grid.innerHTML = services.map(service => buildServiceCardMarkup(service, { compact: true })).join('');
}

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    renderServices();
});

window.buildServiceCardMarkup = buildServiceCardMarkup;
window.serviceVisuals = serviceVisuals;

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
