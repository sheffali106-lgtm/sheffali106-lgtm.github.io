import { app, db } from "./firebase.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const auth = getAuth(app);
const dashboard = document.getElementById("dashboardProperties");

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    loadProperties(user.uid);

});

async function loadProperties(ownerId) {

    dashboard.innerHTML = "<p>Loading properties...</p>";

    try {

        const q = query(
            collection(db, "properties"),
            where("ownerId", "==", ownerId)
        );

        const snapshot = await getDocs(q);

        dashboard.innerHTML = "";

        if (snapshot.empty) {
            dashboard.innerHTML = `
                <p>You haven't listed any properties yet.</p>
            `;
            return;
        }

        snapshot.forEach((property) => {

            const data = property.data();

            dashboard.innerHTML += `
                <div class="card">

                    <img src="${data.image}" alt="${data.title}">

                    <h3>${data.title}</h3>

                    <p>${data.location}</p>

                    <p>KSh ${data.price}/month</p>

                    <button class="btn">
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

        dashboard.innerHTML =
            "<p>Failed to load properties.</p>";

    }

}

window.deleteProperty = async function(id) {

    if (!confirm("Delete this property?")) return;

    await deleteDoc(doc(db, "properties", id));

    location.reload();

};

window.logout = async function() {

    await signOut(auth);

    window.location.href = "login.html";

};