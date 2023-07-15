//client/CreateUserButton.client.js

"use client";

import React from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../firebase.config.js";

function CreateUserButton() {
  const createTestUser = () => {
    const auth = getAuth(app); // pass the app instance to getAuth function
    createUserWithEmailAndPassword(auth, "test@example.com", "password123")
      .then((userCredential) => {
        console.log("User was created successfully");
      })
      .catch((error) => {
        console.error("An error occurred: ", error);
      });
  };

  return <button onClick={createTestUser}>Create Test User</button>;
}

export default CreateUserButton;
