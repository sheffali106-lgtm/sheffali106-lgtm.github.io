import { db } from "./firebase.js";

import {
    doc,
    getDoc
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
