import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

async function loadProperties() {

  const container = document.getElementById("dynamicProperties");

  if (!container) return;

  container.innerHTML = "<p>Loading properties...</p>";

  try {

    const snapshot = await getDocs(collection(db, "properties"));

    container.innerHTML = "";

    if (snapshot.empty) {
      container.innerHTML = "<h3>No properties available.</h3>";
      return;
    }

    snapshot.forEach((doc) => {

      const property = doc.data();

      console.log("Loaded Property:", property);

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${property.image || "https://picsum.photos/400/250"}" alt="${property.title || "Property"}">

        <div class="card-content">

          <h3>${property.title || "No Title"}</h3>

          <p>📍 ${property.location || "Location unavailable"}</p>

          <p>🛏️ ${property.rooms || "N/A"} Bedrooms</p>

          <p class="price">KSh ${property.price || "0"}/month</p>

          <p>${property.description || "No description available."}</p>

          <button class="whatsapp-btn">
            Contact on WhatsApp
          </button>

          <button class="details-btn">
            View Details
          </button>

        </div>
      `;

      card.querySelector(".whatsapp-btn").addEventListener("click", () => {
        window.open("https://wa.me/254799520544", "_blank");
      });

      card.querySelector(".details-btn").addEventListener("click", () => {

        localStorage.setItem(
          "selectedProperty",
          JSON.stringify(property)
        );

        window.location.href = "property.html";

      });

      container.appendChild(card);

    });

  } catch (error) {

    console.error("Firestore Error:", error);

    container.innerHTML = `
      <h3 style="color:red;text-align:center;">
        Failed to load properties.
      </h3>
    `;

  }

}

loadProperties();

window.searchProperties = function () {

  const location =
    document.getElementById("searchLocation")?.value.toLowerCase() || "";

  const rooms =
    document.getElementById("searchRooms")?.value || "";

  const maxPrice =
    document.getElementById("searchPrice")?.value || "";

  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {

    const text = card.innerText.toLowerCase();

    const matchesLocation =
      location === "" || text.includes(location);

    const matchesRooms =
      rooms === "" || text.includes(rooms + " bedroom");

    let matchesPrice = true;

    if (maxPrice !== "") {

      const priceElement = card.querySelector(".price");

      if (priceElement) {

        const price = parseInt(
          priceElement.innerText.replace(/[^0-9]/g, "")
        );

        matchesPrice = price <= parseInt(maxPrice);

      }

    }

    card.style.display =
      (matchesLocation && matchesRooms && matchesPrice)
        ? ""
        : "none";

  });

};
