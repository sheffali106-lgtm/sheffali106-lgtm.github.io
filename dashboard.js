import { app, db } from "./firebase.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const auth = getAuth(app);
const dashboard = document.getElementById("dashboardProperties");

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  loadProperties();

});

async function loadProperties() {

  dashboard.innerHTML = "<p>Loading properties...</p>";

  try {

    const snapshot = await getDocs(collection(db, "properties"));

    dashboard.innerHTML = "";

    if (snapshot.empty) {
      dashboard.innerHTML = "<p>No properties found.</p>";
      return;
    }

    snapshot.forEach((property) => {

      const data = property.data();

      dashboard.innerHTML += `
        <div class="card">

          <img src="${data.image}" alt="${data.title}">

          <h3>${data.title}</h3>

          <p><strong>Location:</strong> ${data.location}</p>

          <p><strong>Price:</strong> KSh ${data.price}</p>

          <button class="btn">Edit</button>

          <button class="btn delete-btn"
            onclick="deleteProperty('${property.id}')">
            Delete
          </button>

        </div>
      `;

    });

  } catch (error) {

    dashboard.innerHTML = "<p>Error loading properties.</p>";
    console.error(error);

  }

}

window.deleteProperty = async function(id) {

  if (!confirm("Delete this property?")) return;

  await deleteDoc(doc(db, "properties", id));

  loadProperties();

};