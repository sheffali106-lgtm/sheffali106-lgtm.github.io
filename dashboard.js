import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const dashboard = document.getElementById("dashboardProperties");

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

            <p><strong>Rooms:</strong> ${data.rooms}</p>

            <p><strong>Price:</strong> KSh ${data.price}/month</p>

            <button class="btn edit-btn">
                Edit
            </button>

            <button class="btn delete-btn"
                onclick="deleteProperty('${property.id}')">
                Delete
            </button>

        </div>
      `;
    });

  } catch (error) {
    console.error(error);
    dashboard.innerHTML = "<p>Error loading properties.</p>";
  }
}

window.deleteProperty = async function (id) {

  const confirmed = confirm("Delete this property?");

  if (!confirmed) return;

  await deleteDoc(doc(db, "properties", id));

  alert("Property deleted successfully.");

  loadProperties();
};

loadProperties();