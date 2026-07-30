
document.querySelectorAll(".details-btn").forEach(button => {
    button.addEventListener("click", () => {

        const card = button.closest(".card");

        const property = {
            title: card.querySelector("h3").innerText,
            location: card.querySelectorAll("p")[0].innerText,
            price: card.querySelector(".price")
                ? card.querySelector(".price").innerText
                : card.querySelector("strong").innerText,
            description: "Beautiful rental property in a prime location."
        };

        localStorage.setItem("selectedProperty", JSON.stringify(property));

        window.location.href = "property.html";
    });
});

document.querySelectorAll(".viewing-btn").forEach(button => {
    button.addEventListener("click", () => {
        alert("Viewing request received! We will contact you shortly.");
    });
});

const savedProperty = JSON.parse(localStorage.getItem("latestProperty"));

if (savedProperty) {

    const properties = document.querySelector(".properties");

    if (properties) {

        const newCard = document.createElement("div");

        newCard.className = "card";

        newCard.innerHTML = `
            <div class="card-content">
                <h3>${savedProperty.title}</h3>
                <p>📍 ${savedProperty.location}</p>
                <p>🛏️ ${savedProperty.rooms} Bedrooms</p>
                <p class="price">KSh ${savedProperty.price}/month</p>
                <p>${savedProperty.description}</p>

                <button onclick="window.open('https://wa.me/254799520544','_blank')">
                    Contact on WhatsApp
                </button>

                <button class="details-btn">
                    View Details
                </button>
            </div>
        `;

        properties.prepend(newCard);
    }
}

function searchProperties() {

    const input = document.getElementById("searchInput");

    if (!input) return;

    const filter = input.value.toLowerCase();

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        const text = card.innerText.toLowerCase();

        if (text.includes(filter)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });

}
