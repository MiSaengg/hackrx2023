import React, { useEffect, useState } from 'react';
import 'firebaseui/dist/firebaseui.css';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import { useRouter } from 'next/router';
import { EmailAuthProvider } from 'firebase/auth';

const LoginPage = () => {
  const [ui, setUi] = useState(null);
  const auth = getAuth();
  const router = useRouter();

  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        const user = authResult.user;
        
        if (authResult.additionalUserInfo.isNewUser) {
          createUserAndSetRoles(user.uid , user.displayName, user.email,);
        } else {
          return true;
        }
        return false;
      },
    },
    signInFlow: 'popup',
    signInSuccessUrl: '/main',
    signInOptions: [
      EmailAuthProvider.PROVIDER_ID,
    ],
  };

  useEffect(() => {
    import('firebaseui').then((firebaseui) => {
      if (typeof window !== 'undefined') {
        const firebaseUiInstance =
          firebaseui.auth.AuthUI.getInstance() ||
          new firebaseui.auth.AuthUI(auth);

        setUi(firebaseUiInstance);
      }
    });
  }, []);

  useEffect(() => {
    if (ui) {
      ui.start('#firebaseui-auth-container', uiConfig);
    }
  }, [ui]);

  const createUserAndSetRoles = async (uid , name, email) => {
    const usersRef = collection(db, 'users');

    await setDoc(doc(usersRef , uid), {
      user_name : name,
      email : email,
      roles: 'viewer',
    });

    router.push({
      pathname: '/main',
      query: { roles: 'viewer' },
    });
  };

  return (
    <div>
      <h1>Login Page</h1>
      <div id="firebaseui-auth-container"></div>
    </div>
  );
};

export default LoginPage;
