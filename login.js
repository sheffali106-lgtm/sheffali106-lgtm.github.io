import { app } from "./firebase.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const auth = getAuth(app);

const email = document.getElementById("email");
const password = document.getElementById("password");

document.getElementById("signupBtn").addEventListener("click", async () => {

  try {

    await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    alert("Account created successfully!");

    window.location.href = "dashboard.html";

  } catch (error) {

    alert(error.message);

  }

});

document.getElementById("loginBtn").addEventListener("click", async () => {

  try {

    await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    alert("Login successful!");

    window.location.href = "dashboard.html";

  } catch (error) {

    alert(error.message);

  }

});