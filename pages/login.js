import React, { useEffect, useState } from "react";
import Link from "next/link";
import "firebaseui/dist/firebaseui.css";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { useRouter } from "next/router";
import { EmailAuthProvider } from "firebase/auth";
import "../public/styles.css";

const LoginPage = () => {
  const [ui, setUi] = useState(null);
  const auth = getAuth();
  const router = useRouter();

  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        const user = authResult.user;

        if (authResult.additionalUserInfo.isNewUser) {
          createUserAndSetRoles(user.uid, user.displayName, user.email);
        } else {
          return true;
        }
        return false;
      },
    },
    signInFlow: "popup",
    signInSuccessUrl: "/main",
    signInOptions: [EmailAuthProvider.PROVIDER_ID],
  };

  useEffect(() => {
    import("firebaseui").then((firebaseui) => {
      if (typeof window !== "undefined") {
        const firebaseUiInstance =
          firebaseui.auth.AuthUI.getInstance() ||
          new firebaseui.auth.AuthUI(auth);

        setUi(firebaseUiInstance);
      }
    });
  }, []);

  useEffect(() => {
    if (ui) {
      ui.start("#firebaseui-auth-container", uiConfig);
    }
  }, [ui]);

  const createUserAndSetRoles = async (uid, name, email) => {
    const usersRef = collection(db, "users");

    await setDoc(doc(usersRef, uid), {
      user_name: name,
      email: email,
      roles: "viewer",
    });

    router.push({
      pathname: "/main",
      query: { roles: "viewer" },
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <Link href="/">
        <div className="flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg> 
        Back
        </div>
      </Link>
      <div className="z-10 w-full max-w-lg px-32 py-32 bg-white shadow-md rounded-lg flex flex-col items-center justify-center font-mono text-lg">
        <h1 className="text-3xl font-bold text-center">Login Page</h1>
        <div id="firebaseui-auth-container" className="mt-3 px-30 py-30"></div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"></div>
    </main>
  );
};

export default LoginPage;
