import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const propertiesContainer = document.getElementById('propertiesContainer') || document.getElementById('propertyList');
const searchInput = document.getElementById('searchInput') || document.querySelector('input[type="search"]') || document.querySelector('#search');
const searchBtn = document.getElementById('searchBtn');

let allProperties = [];

// RENDER FUNCTION - handles both field names
function renderProperties(properties) {
    if (!propertiesContainer) return;
    
    if (properties.length === 0) {
        propertiesContainer.innerHTML = `<p style="text-align:center; padding:40px;">No properties found. Try a different search.</p>`;
        return;
    }

    propertiesContainer.innerHTML = properties.map(prop => {
        const location = prop.location || prop.area || prop.town || "Location unavailable";
        const rooms = prop.rooms || prop.bedrooms || prop.beds || "N/A";
        const price = prop.price || prop.rent || 0;
        const formattedPrice = typeof price === 'number' ? price.toLocaleString() : price;
        const image = prop.image || prop.imageUrl || prop.photo || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800";
        const title = prop.title || "Rental Property";
        const id = prop.id;

        return `
        <div class="property-card">
            <img src="${image}" alt="${title}" loading="lazy">
            <div class="property-info">
                <h3>${title}</h3>
                <p>📍 ${location}</p>
                <p>🛏️ ${rooms} Bedrooms</p>
                <p><strong>KSh ${formattedPrice}/month</strong></p>
                <a href="property.html?id=${id}" class="btn">View Details</a>
            </div>
        </div>
        `;
    }).join('');
}

// FETCH FROM FIREBASE
async function loadProperties() {
    try {
        if (propertiesContainer) propertiesContainer.innerHTML = "<p style='text-align:center;'>Loading properties...</p>";
        
        const querySnapshot = await getDocs(collection(db, "properties"));
        allProperties = [];
        
        querySnapshot.forEach((doc) => {
            allProperties.push({ id: doc.id, ...doc.data() });
        });

        // Sort by newest first
        allProperties.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        
        renderProperties(allProperties);
    } catch (error) {
        console.error("Error loading properties:", error);
        if (propertiesContainer) propertiesContainer.innerHTML = `<p style='color:red; text-align:center;'>Failed to load properties: ${error.message}</p>`;
    }
}

// SEARCH FUNCTION - THIS IS THE FIX FOR OPTION 1
function handleSearch() {
    if (!searchInput) return;
    
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        renderProperties(allProperties);
        return;
    }

    const filtered = allProperties.filter(p => {
        const title = (p.title || "").toLowerCase();
        const location = (p.location || p.area || p.town || "").toLowerCase();
        const description = (p.description || p.desc || "").toLowerCase();
        const price = String(p.price || p.rent || "").toLowerCase();
        const rooms = String(p.rooms || p.bedrooms || "").toLowerCase();

        return title.includes(query) || 
               location.includes(query) || 
               description.includes(query) ||
               price.includes(query) ||
               rooms.includes(query);
    });

    renderProperties(filtered);
}

// EVENT LISTENERS
if (searchInput) {
    searchInput.addEventListener('input', handleSearch); // Live search as you type
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
}

if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleSearch();
    });
}

// INITIAL LOAD
loadProperties();