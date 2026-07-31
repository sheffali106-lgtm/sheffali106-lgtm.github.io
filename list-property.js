import { db, auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const form = document.getElementById('propertyForm');
const loading = document.getElementById('loadingMessage');
const section = document.getElementById('propertySection');
const message = document.getElementById('formMessage');

let currentUser = null;

// THIS FIXES YOUR "Checking your account..." STUCK
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "landlord-login.html";
        return;
    }
    currentUser = user;
    loading.style.display = "none";
    section.style.display = "block";
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    message.innerHTML = "Listing...";
    try {
        const title = document.getElementById('title').value.trim();
        const location = document.getElementById('location').value.trim();
        const bedrooms = parseInt(document.getElementById('bedrooms').value);
        const price = parseInt(document.getElementById('price').value);
        const type = document.getElementById('type').value;
        const phone = document.getElementById('phone').value.trim();
        const amenities = document.getElementById('amenities').value.trim();
        const featured = document.getElementById('featured').checked;
        const description = document.getElementById('description').value.trim();
        const imageInput = document.getElementById('image').value.trim();
        const images = imageInput? imageInput.split(',').map(s => s.trim()) : [];
        const mainImage = images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800";

        await addDoc(collection(db, "properties"), {
            title, location, area: location,
            bedrooms, rooms: bedrooms,
            price, rent: price,
            type, phone, amenities, featured, description,
            image: mainImage, imageUrl: mainImage, images,
            landlordId: currentUser.uid,
            landlordEmail: currentUser.email,
            createdAt: serverTimestamp()
        });
        message.innerHTML = `<p style="color:green;">✅ Listed! <a href="index.html">View it</a></p>`;
        form.reset();
    } catch (err) {
        message.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
});