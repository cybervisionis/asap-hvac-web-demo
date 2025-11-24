// ASAP HVAC Prototype App

let appData = {};
const PIPELINE_STATE_KEY = 'asapPipelineState';
const PIPELINE_HISTORY_KEY = 'asapPipelineHistory';

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
window.getAppData = () => appData;

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

function getCombinedQuotes() {
    const stored = getQuoteRequests();
    const seed = (appData.quoteRequests || []).map(q => ({ ...q, source: 'seed' }));
    const manual = stored.map(q => ({ ...q, source: 'manual' }));
    const allIds = new Set();
    const combined = [];
    [...seed, ...manual].forEach(q => {
        if (!allIds.has(q.id)) {
            allIds.add(q.id);
            combined.push(q);
        }
    });
    return combined.sort((a, b) => {
        const aDate = a.requestedDate || a.createdAt || '';
        const bDate = b.requestedDate || b.createdAt || '';
        return aDate < bDate ? 1 : -1;
    });
}

function promoteManualQuote(quoteRequestId) {
    const stored = getQuoteRequests();
    const match = stored.find(q => q.id === quoteRequestId);
    if (!match) return null;
    const finalQuoteId = 'fq-' + Date.now();
    const invoiceId = 'inv-' + Date.now();
    const customer = (appData.customers || []).find(c => c.email === match.email) || {
        id: 'cust-' + Date.now(),
        name: match.customerName,
        primaryAddress: match.address,
        email: match.email,
        phone: match.contactPhone,
        planTier: null,
        maintenancePlanId: null
    };
    const finalQuote = {
        id: finalQuoteId,
        quoteRequestId: match.id,
        baseEstimate: 150,
        adjustmentsTotal: 0,
        finalTotal: 150,
        expiresOn: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        status: 'awaiting-approval'
    };
    const invoice = {
        id: invoiceId,
        finalQuoteId: finalQuoteId,
        amountDue: finalQuote.finalTotal,
        createdOn: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
        paid: false,
        paymentRef: null
    };
    if (!appData.finalQuotes) appData.finalQuotes = [];
    if (!appData.invoices) appData.invoices = [];
    if (!appData.customers) appData.customers = [];
    appData.finalQuotes.push(finalQuote);
    appData.invoices.push(invoice);
    if (!appData.customers.find(c => c.id === customer.id)) {
        appData.customers.push(customer);
    }
    updateQuoteStage(finalQuoteId, 'awaiting-approval', { customerName: match.customerName, label: `Promoted ${match.customerName} from web submission` });
    return { finalQuote, invoice, customer };
}

function getQuoteRequestById(id) {
    return (appData.quoteRequests || []).find(q => q.id === id) || null;
}

function getFinalQuoteById(id) {
    return (appData.finalQuotes || []).find(fq => fq.id === id) || null;
}

function getInvoiceById(id) {
    return (appData.invoices || []).find(inv => inv.id === id) || null;
}

function getAppointmentByQuoteId(quoteRequestId) {
    return (appData.appointments || []).find(a => a.quoteRequestId === quoteRequestId) || null;
}

function getInspectionByQuoteId(quoteRequestId) {
    return (appData.inspections || []).find(i => i.quoteRequestId === quoteRequestId) || null;
}

function getCustomerByPlan(planId) {
    if (!planId) return null;
    return (appData.customers || []).find(c => c.maintenancePlanId === planId) || null;
}

function getCustomerFromQuote(quoteRequest) {
    if (!quoteRequest) return null;
    return (appData.customers || []).find(c => c.email === quoteRequest.email) || null;
}

function getQuoteContext(finalQuoteId) {
    const finalQuote = getFinalQuoteById(finalQuoteId);
    if (!finalQuote) return null;
    const quoteRequest = getQuoteRequestById(finalQuote.quoteRequestId);
    return {
        finalQuote,
        quoteRequest,
        inspection: getInspectionByQuoteId(finalQuote.quoteRequestId),
        appointment: getAppointmentByQuoteId(finalQuote.quoteRequestId),
        invoice: (appData.invoices || []).find(inv => inv.finalQuoteId === finalQuoteId) || null
    };
}

function getPipelineState() {
    const defaultState = { quotes: {}, invoices: {}, appointments: {} };
    try {
        const stored = JSON.parse(localStorage.getItem(PIPELINE_STATE_KEY) || '{}');
        return {
            quotes: stored.quotes || {},
            invoices: stored.invoices || {},
            appointments: stored.appointments || {}
        };
    } catch (err) {
        console.warn('Pipeline state reset due to parse error', err);
        localStorage.removeItem(PIPELINE_STATE_KEY);
        return defaultState;
    }
}

function savePipelineState(nextState) {
    localStorage.setItem(PIPELINE_STATE_KEY, JSON.stringify(nextState));
    return nextState;
}

function recordPipelineHistory(entry) {
    const history = JSON.parse(localStorage.getItem(PIPELINE_HISTORY_KEY) || '[]');
    const timestamp = entry.timestamp || new Date().toISOString();
    history.unshift({ ...entry, timestamp });
    localStorage.setItem(PIPELINE_HISTORY_KEY, JSON.stringify(history.slice(0, 15)));
    return history;
}

function getPipelineHistory() {
    return JSON.parse(localStorage.getItem(PIPELINE_HISTORY_KEY) || '[]');
}

function updateQuoteStage(finalQuoteId, stage, meta = {}) {
    const state = getPipelineState();
    state.quotes[finalQuoteId] = { stage, updatedAt: new Date().toISOString(), ...meta };
    savePipelineState(state);
    recordPipelineHistory({
        type: 'quote',
        finalQuoteId,
        stage,
        label: meta.label || `Quote ${finalQuoteId} → ${stage}`,
        customer: meta.customerName || null
    });
    return state.quotes[finalQuoteId];
}

function updateInvoiceStatus(invoiceId, status, meta = {}) {
    const state = getPipelineState();
    state.invoices[invoiceId] = { status, updatedAt: new Date().toISOString(), ...meta };
    savePipelineState(state);
    recordPipelineHistory({
        type: 'invoice',
        invoiceId,
        stage: status,
        label: meta.label || `Invoice ${invoiceId} → ${status}`,
        customer: meta.customerName || null
    });
    return state.invoices[invoiceId];
}

function getQuoteStage(finalQuoteId, fallback) {
    const state = getPipelineState();
    return state.quotes[finalQuoteId]?.stage || fallback || 'awaiting-approval';
}

function getInvoiceStage(invoiceId, fallback) {
    const state = getPipelineState();
    return state.invoices[invoiceId]?.status || (fallback ? (fallback.paid ? 'paid' : 'sent') : 'draft');
}

window.dashboardHelpers = {
    getQuoteRequestById,
    getFinalQuoteById,
    getQuoteContext,
    getAppointmentByQuoteId,
    getInspectionByQuoteId,
    getInvoiceById,
    getPipelineState,
    getPipelineHistory,
    updateQuoteStage,
    updateInvoiceStatus,
    getQuoteStage,
    getInvoiceStage,
    recordPipelineHistory,
    saveQuoteRequest,
    getQuoteRequests,
    getCombinedQuotes,
    promoteManualQuote
};
