import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

async function loadProperties() {

    const container = document.getElementById("dynamicProperties");

    if (!container) return;

    container.innerHTML = "";

    try {

        const querySnapshot = await getDocs(collection(db, "properties"));

        querySnapshot.forEach((doc) => {

            const property = doc.data();

            const card = document.createElement("div");

            card.className = "card";

            card.innerHTML = `
                <div class="card-content">

                    <h3>${property.title}</h3>

                    <p>📍 ${property.location}</p>

                    <p>🛏️ ${property.rooms} Bedrooms</p>

                    <p class="price">KSh ${property.price}/month</p>

                    <p>${property.description}</p>

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

        console.error("Error loading properties:", error);

        container.innerHTML = `
            <p>Failed to load properties. Please try again later.</p>
        `;
    }
}
