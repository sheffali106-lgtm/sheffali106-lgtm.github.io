import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

document.getElementById("propertyForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    try {
        await addDoc(collection(db, "properties"), {
            title: document.getElementById("title").value,
            location: document.getElementById("location").value,
            price: document.getElementById("price").value,
            rooms: document.getElementById("rooms").value,
            description: document.getElementById("description").value,
            createdAt: new Date()
        });

        alert("✅ Property saved to Firebase!");

        document.getElementById("propertyForm").reset();

    } catch (error) {
        console.error(error);
        alert("❌ Error saving property.");
    }
});
