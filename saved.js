import { db, auth } from "./firebase.js";
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const container = document.getElementById("savedProperties");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    container.innerHTML = "<p>Please <a href='landlord-login.html'>login</a> to see saved properties.</p>";
    return;
  }

  const q = query(collection(db, "saved"), where("userId", "==", user.uid));
  const snap = await getDocs(q);

  if (snap.empty) {
    container.innerHTML = "<p>You haven't saved any properties yet. ❤️</p>";
    return;
  }

  container.innerHTML = "";
  for (const savedDoc of snap.docs) {
    const propId = savedDoc.data().propertyId;
    const propSnap = await getDoc(doc(db, "properties", propId));
    if (propSnap.exists()) {
      const p = propSnap.data();
      const div = document.createElement("div");
      div.className = "property-card";
      div.innerHTML = `
        <img src="${p.imageUrl}" style="width:100%; height:180px; object-fit:cover; border-radius:10px;">
        <h3>${p.title}</h3>
        <p>${p.location} - Ksh ${p.price}</p>
        <a href="property.html?id=${propSnap.id}" class="btn">View</a>
        <button onclick="unsave('${savedDoc.id}')" class="btn" style="background:#ff4757; margin-top:8px;">Remove ❤️</button>
      `;
      container.appendChild(div);
    }
  }
});

window.unsave = async (savedId) => {
  await deleteDoc(doc(db, "saved", savedId));
  location.reload();
};