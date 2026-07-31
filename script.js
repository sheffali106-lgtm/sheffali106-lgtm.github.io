import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const container = document.getElementById('dynamicProperties');
const searchLocation = document.getElementById('searchLocation');
const searchType = document.getElementById('searchType');
const searchBedrooms = document.getElementById('searchBedrooms');
const searchPrice = document.getElementById('searchPrice');
const searchBtn = document.getElementById('searchBtn');

let allProperties = [];

function render(properties) {
    if (!container) return;
    if (properties.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:30px;">No properties found. Try different filters.</p>`;
        return;
    }
    container.innerHTML = properties.map(p => {
        const location = p.location || p.area || "Location unavailable";
        const rooms = p.rooms || p.bedrooms || "N/A";
        const price = p.price || p.rent || 0;
        const formattedPrice = typeof price === 'number' ? price.toLocaleString() : price;
        const image = p.image || p.imageUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800";
        const title = p.title || "Rental Property";
        const id = p.id;
        return `
        <div class="property-card">
            <img src="${image}" alt="${title}">
            <div class="property-info">
                <h3>${title}</h3>
                <p>📍 ${location}</p>
                <p>🛏️ ${rooms} Bedrooms</p>
                <p><strong>KSh ${formattedPrice}/month</strong></p>
                <a href="property.html?id=${id}" class="btn">View Details</a>
            </div>
        </div>`;
    }).join('');
}

async function load() {
    if (container) container.innerHTML = "<p style='text-align:center;'>Loading...</p>";
    const snap = await getDocs(collection(db, "properties"));
    allProperties = [];
    snap.forEach(d => allProperties.push({ id: d.id, ...d.data() }));
    allProperties.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    render(allProperties);
}

function doSearch() {
    let filtered = [...allProperties];
    const loc = searchLocation.value.toLowerCase().trim();
    const type = searchType.value.toLowerCase().trim();
    const beds = searchBedrooms.value;
    const maxPrice = parseInt(searchPrice.value);

    if (loc) {
        filtered = filtered.filter(p => {
            const fullText = `${p.title || ''} ${p.location || ''} ${p.area || ''} ${p.description || ''}`.toLowerCase();
            return fullText.includes(loc);
        });
    }
    if (type) {
        filtered = filtered.filter(p => {
            const fullText = `${p.title || ''} ${p.description || ''} ${p.type || ''}`.toLowerCase();
            return fullText.includes(type);
        });
    }
    if (beds) {
        filtered = filtered.filter(p => {
            const r = parseInt(p.rooms || p.bedrooms || 0);
            if (beds === "5") return r >= 5;
            return r == parseInt(beds);
        });
    }
    if (!isNaN(maxPrice) && maxPrice > 0) {
        filtered = filtered.filter(p => {
            const price = parseInt(p.price || p.rent || 0);
            return price <= maxPrice;
        });
    }
    render(filtered);
}

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    doSearch();
});

searchLocation.addEventListener('input', doSearch);
searchType.addEventListener('change', doSearch);
searchBedrooms.addEventListener('change', doSearch);
searchPrice.addEventListener('input', doSearch);

load();