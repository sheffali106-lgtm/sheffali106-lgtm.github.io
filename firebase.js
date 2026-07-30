import { initializeApp } from "https://www.gstatic.com/firebasejs/...";

const firebaseConfig = {
  ...
};

const app = initializeApp(firebaseConfig);
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const db = getFirestore(app);

export { db };
