import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const propertyId = localStorage.getItem("editPropertyId");

if (!propertyId) {
    alert("No property selected.");
    window.location.href = "dashboard.html";
}

const propertyRef = doc(db, "properties", propertyId);

const propertySnap = await getDoc(propertyRef);

if (propertySnap.exists()) {

    const property = propertySnap.data();

    document.getElementById("title").value = property.title || "";
    document.getElementById("location").value = property.location || "";
    document.getElementById("price").value = property.price || "";
    document.getElementById("rooms").value = property.rooms || "";
    document.getElementById("image").value = property.image || "";
    document.getElementById("description").value = property.description || "";
}

document.getElementById("editForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        await updateDoc(propertyRef, {

            title: document.getElementById("title").value,
            location: document.getElementById("location").value,
            price: document.getElementById("price").value,
            rooms: document.getElementById("rooms").value,
            image: document.getElementById("image").value,
            description: document.getElementById("description").value

        });

        alert("Property updated successfully!");

        localStorage.removeItem("editPropertyId");

        window.location.href = "dashboard.html";

    } catch (error) {

        console.error(error);

        alert("Failed to update property.");

    }

});
