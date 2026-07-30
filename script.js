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

        const snapshot = await getDocs(collection(db, "properties"));

        snapshot.forEach((doc) => {

            const property = doc.data();

            const card = document.createElement("div");

            card.className = "card";

            card.innerHTML = `
                <img src="${property.image || 'https://picsum.photos/400/250'}" alt="${property.title}">

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

        console.error(error);

        container.innerHTML = `
            <h3 style="text-align:center;">
                Unable to load properties.
            </h3>
        `;
    }

}

loadProperties();
window.searchProperties = function () {

    const searchInput = document.getElementById("searchInput");

    if (!searchInput) return;

    const filter = searchInput.value.toLowerCase();

    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {

        const text = card.innerText.toLowerCase();

        if (text.includes(filter)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });

};
