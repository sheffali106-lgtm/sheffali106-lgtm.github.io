import { app, db } from "./firebase.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const auth = getAuth(app);

const form = document.getElementById("propertyForm");
const messageDiv = document.getElementById("formMessage");
const section = document.getElementById("propertySection");
const loadingMessage = document.getElementById("loadingMessage");

section.style.display = "none";

let currentUser = null;

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    loadingMessage.style.display = "none";
    section.style.display = "block";

});

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const location = document.getElementById("location").value.trim();
    const bedrooms = parseInt(document.getElementById("bedrooms").value);
    const price = parseInt(document.getElementById("price").value);

    const type = document.getElementById("type").value;
    const phone = document.getElementById("phone").value.trim();
    const amenities = document.getElementById("amenities").value.trim();
    const featured = document.getElementById("featured").checked;
    const description = document.getElementById("description").value.trim();

    const imageInput = document.getElementById("image").value.trim();

    const images = imageInput
        ? imageInput.split(",").map(url => url.trim()).filter(Boolean)
        : ["https://picsum.photos/800/500"];

    try {

        await addDoc(collection(db, "properties"), {

            ownerId: currentUser.uid,
            ownerEmail: currentUser.email,

            title,
            location,

            rooms: bedrooms,
            bedrooms,

            price,
            rent: price,

            type,
            phone,
            amenities,
            featured,

            description,

            image: images[0],
            imageUrl: images[0],
            images,

            createdAt: serverTimestamp()

        });

        messageDiv.innerHTML =
            "<p style='color:green;'>✅ Property listed successfully!</p>";

        form.reset();

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1500);

    } catch (error) {

        console.error(error);

        messageDiv.innerHTML =
            `<p style="color:red;">${error.message}</p>`;

    }

});