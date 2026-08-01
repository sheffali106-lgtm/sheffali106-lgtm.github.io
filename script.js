import { db, auth } from "./firebase.js";
import { collection, getDocs, query, where, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const container = document.getElementById("dynamicProperties");

// Load all properties
async function loadProperties() {
  if (!container) return;
  
  const querySnapshot = await getDocs(collection(db, "properties"));
  container.innerHTML = "";

  if (querySnapshot.empty) {
    container.innerHTML = "<p>No properties found yet.</p>";
    return;
  }

  querySnapshot.forEach((docSnap) => {
    const p = docSnap.data();
    const id = docSnap.id;
    
    const card = document.createElement("div");
    card.className = "property-card";
    card.innerHTML = `
      <img src="${p.imageUrl || 'https://via.placeholder.com/300'}" alt="${p.title}" style="width:100%; height:180px; object-fit:cover; border-radius:10px;">
      <h3>${p.title}</h3>
      <p>📍 ${p.location}</p>
      <p><strong>Ksh ${p.price}</strong> / month</p>
      <p>${p.type || ''} - ${p.bedrooms || ''} Beds</p>
      <div style="display:flex; gap:8px; margin-top:10px;">
        <a href="property.html?id=${id}" class="btn" style="flex:1; text-align:center;">View</a>
        <button onclick="toggleSave('${id}')" class="btn" style="flex:1; background:#ff4757;">❤️ Save</button>
      </div>
    `;
    container.appendChild(card);
  });
}

loadProperties();

// SAVE / UNSAVE FUNCTION
window.toggleSave = async (propertyId) => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please login to save properties");
    window.location.href = "landlord-login.html";
    return;
  }

  // Check if already saved
  const q = query(collection(db, "saved"), where("userId", "==", user.uid), where("propertyId", "==", propertyId));
  const snap = await getDocs(q);

  if (!snap.empty) {
    alert("Already saved! Go to Saved page to view ❤️");
    window.location.href = "saved.html";
    return;
  }

  try {
    await addDoc(collection(db, "saved"), {
      userId: user.uid,
      propertyId: propertyId,
      savedAt: new Date()
    });
    alert("Saved ❤️ - View in Saved page");
  } catch (err) {
    alert("Error saving: " + err.message);
  }
};