// pages/login.js

import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '../firebase/firebase.config';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const loginUser = async () => {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setErrorMessage('');
        router.push('/main');
      })
      .catch((error) => {
        console.error('An error occurred: ', error);

        if (error.code === 'auth/user-not-found') {
          setErrorMessage('No user found');
        } else if (error.code === 'auth/wrong-password') {
          setErrorMessage('Wrong password');
        } else {
          setErrorMessage('Error with log in');
        }
      });
  };

  return (
    <div>
      <h1>Login Page</h1>
      {errorMessage && <p>{errorMessage}</p>}
      <input
        type="text"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={loginUser}>Login</button>
    </div>
  );
};

export default LoginPage;
