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
            
            console.log("Property:", property);
            
            const card = document.createElement("div")

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

    const location =
        document.getElementById("searchLocation").value.toLowerCase();

    const rooms =
        document.getElementById("searchRooms").value;

    const maxPrice =
        document.getElementById("searchPrice").value;

    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {

        const text = card.innerText.toLowerCase();

        const matchesLocation =
            location === "" || text.includes(location);

        const matchesRooms =
            rooms === "" || text.includes(rooms + " bedroom");

        let matchesPrice = true;

        if (maxPrice !== "") {

            const priceText =
                card.querySelector(".price").innerText;

            const priceElement = card.querySelector(".price");

if (!priceElement) return;

const price =
    parseInt(priceElement.innerText.replace(/[^0-9]/g, ""));
        }

        if (matchesLocation && matchesRooms && matchesPrice) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });

};
