import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


const container =
    document.getElementById("dashboardProperties");


async function loadDashboard() {

    if (!container) return;

    container.innerHTML =
        "<p>Loading properties...</p>";


    try {

        const snapshot =
            await getDocs(
                collection(db, "properties")
            );


        container.innerHTML = "";


        if (snapshot.empty) {

            container.innerHTML = `
                <p>No properties have been listed yet.</p>
            `;

            return;
        }


        snapshot.forEach((propertyDoc) => {

            const property =
                propertyDoc.data();

            const card =
                document.createElement("div");

            card.className = "card";


            card.innerHTML = `

                <img
                    src="${property.image || 'https://picsum.photos/400/250'}"
                    alt="${property.title || 'Property'}"
                >

                <div class="card-content">

                    <h3>
                        ${property.title || "Untitled Property"}
                    </h3>

                    <p>
                        📍 ${property.location || "Unknown location"}
                    </p>

                    <p>
                        🛏️ ${property.rooms || "N/A"} Bedrooms
                    </p>

                    <p class="price">
                        KSh ${property.price || "0"}/month
                    </p>

                    <p>
                        ${property.description || "No description"}
                    </p>


                    <button
                        class="details-btn edit-btn">
                        Edit
                    </button>


                    <button
                        class="whatsapp-btn delete-btn">
                        Delete
                    </button>

                </div>

            `;


            card
                .querySelector(".edit-btn")
                .addEventListener("click", () => {

                    localStorage.setItem(
                        "editPropertyId",
                        propertyDoc.id
                    );

                    localStorage.setItem(
                        "editProperty",
                        JSON.stringify(property)
                    );

                    alert(
                        "Edit feature will be added next."
                    );

                });


            card
                .querySelector(".delete-btn")
                .addEventListener("click", async () => {

                    const confirmed =
                        confirm(
                            "Are you sure you want to delete this property?"
                        );


                    if (!confirmed) return;


                    try {

                        await deleteDoc(
                            doc(
                                db,
                                "properties",
                                propertyDoc.id
                            )
                        );


                        card.remove();


                        alert(
                            "Property deleted successfully."
                        );


                    } catch (error) {

                        console.error(error);

                        alert(
                            "Unable to delete property."
                        );

                    }

                });


            container.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        container.innerHTML = `

            <p style="color:red;">
                Unable to load properties.
            </p>

        `;

    }

}


loadDashboard();
