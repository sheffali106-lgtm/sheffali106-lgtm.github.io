document.getElementById("propertyForm").addEventListener("submit", function(e){

e.preventDefault();

let property = {
title: document.getElementById("title").value,
location: document.getElementById("location").value,
price: document.getElementById("price").value,
rooms: document.getElementById("rooms").value,
description: document.getElementById("description").value
};

localStorage.setItem("property", JSON.stringify(property));

alert("Property added successfully!");

});
