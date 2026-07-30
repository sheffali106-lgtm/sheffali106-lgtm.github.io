document.querySelector("button").addEventListener("click", function () {
    window.open("https://wa.me/254700000000", "_blank");
});
document.querySelectorAll(".details-btn").forEach(button=>{
button.onclick=()=>{
window.location.href="property.html";
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
        <button>Contact on WhatsApp</button>
    `;

    properties.prepend(newCard);
}
