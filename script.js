
document.querySelectorAll(".details-btn").forEach(button => {
    button.onclick = () => {
        const card = button.closest(".card");

        const property = {
            title: card.querySelector("h3").innerText,
            location: card.querySelector("p").innerText,
            price: card.querySelector(".price")
                ? card.querySelector(".price").innerText
                : card.querySelector("strong").innerText,
            description: card.querySelectorAll("p")[3]
                ? card.querySelectorAll("p")[3].innerText
                : ""
        };

        localStorage.setItem("selectedProperty", JSON.stringify(property));

        window.location.href = "property.html";
    };
});
document.querySelectorAll(".viewing-btn").forEach(button=>{
    button.onclick=()=>{
        alert("Viewing request received! We will contact you shortly.");
    };
});
const savedProperty = JSON.parse(localStorage.getItem("latestProperty"));

if (savedProperty) {
    const properties = document.querySelector(".properties");

    const newCard = document.createElement("div");
    newCard.className = "card";

    newCard.innerHTML = `
        <h3>${savedProperty.title}</h3>
        <p>📍 ${savedProperty.location}</p>
        <p><strong>KSh ${savedProperty.price}/month</strong></p>
        <p>🛏️ ${savedProperty.rooms} Bedrooms</p>
        <p>${savedProperty.description}</p>
        
    `;<button onclick="window.open('https://wa.me/254700000000','_blank')">
    Contact on WhatsApp
</button>

    properties.prepend(newCard);
}
