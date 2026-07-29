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
