import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const WHATSAPP_NUMBER = "254799520544";

// ===============================
// LOAD PROPERTIES
// ===============================
async function loadProperties() {
  const container = document.getElementById("dynamicProperties");
  if (!container) return;

  container.innerHTML = `<p style="text-align:center;">Loading properties...</p>`;

  try {
    const snapshot = await getDocs(collection(db, "properties"));
    container.innerHTML = "";

    if (snapshot.empty) {
      container.innerHTML = `<div style="text-align:center;"><h3>No properties available.</h3><p>Check again later.</p></div>`;
      return;
    }

    snapshot.forEach((documentSnapshot) => {
      const property = documentSnapshot.data();

      console.log("Property loaded:", documentSnapshot.id, property);

      // FIXED: Check for alternative field names (rooms vs bedrooms, etc)
      const title = property.title || "Rental Property";
      const location = property.location || property.area || property.town || "Location unavailable";
      const rooms = property.rooms || property.bedrooms || property.beds || "N/A";
      const price = property.price || property.rent || "Price not available";
      const description = property.description || property.desc || "No description available.";
      const image = property.image || property.imageUrl || property.photo || "https://picsum.photos/800/500";

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${image}" alt="${title}" onerror="this.src='https://picsum.photos/800/500'">
        <div class="card-content">
          <h3>${title}</h3>
          <p>📍 ${location}</p>
          <p>🛏️ ${rooms} Bedrooms</p>
          <p class="price">KSh ${price}/month</p>
          <p>${description}</p>
          <button class="whatsapp-btn">Contact on WhatsApp</button>
          <button class="details-btn">View Details</button>
        </div>
      `;

      // WHATSAPP BUTTON
      const whatsappButton = card.querySelector(".whatsapp-btn");
      whatsappButton.addEventListener("click", () => {
        const message = `Hello, I am interested in ${title} in ${location}.`;
        const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, "_blank");
      });

      // VIEW DETAILS BUTTON - FIXED
      const detailsButton = card.querySelector(".details-btn");
      detailsButton.addEventListener("click", () => {
        // Save to localStorage as backup
        localStorage.setItem(
          "selectedProperty",
          JSON.stringify({
            id: documentSnapshot.id,
            title: title,
            location: location,
            rooms: rooms,
            price: price,
            description: description,
            image: image
          })
        );

        // FIXED: Now pass the ID in the URL
        window.location.href = `property.html?id=${documentSnapshot.id}`;
      });

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Firestore Error:", error);
    container.innerHTML = `<div style="text-align:center; padding:30px;"><h3 style="color:red;">Failed to load properties.</h3><p>Please try again later.</p></div>`;
  }
}

loadProperties();

// ===============================
// SEARCH (unchanged)
// ===============================
window.searchProperties = function () {
  const locationInput = document.getElementById("searchLocation");
  const roomsInput = document.getElementById("searchRooms");
  const priceInput = document.getElementById("searchPrice");
  const location = locationInput?.value.trim().toLowerCase() || "";
  const rooms = roomsInput?.value || "";
  const maxPrice = priceInput?.value || "";
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const text = card.innerText.toLowerCase();
    const matchesLocation = location === "" || text.includes(location);
    let matchesRooms = true;
    if (rooms !== "") {
      matchesRooms = text.includes(rooms + " bedrooms") || text.includes(rooms + " bedroom");
    }
    let matchesPrice = true;
    if (maxPrice !== "") {
      const priceElement = card.querySelector(".price");
      if (priceElement) {
        const priceText = priceElement.innerText.replace(/[^0-9]/g, "");
        const price = parseInt(priceText, 10);
        if (!isNaN(price)) {
          matchesPrice = price <= parseInt(maxPrice, 10);
        }
      }
    }
    if (matchesLocation && matchesRooms && matchesPrice) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
};
