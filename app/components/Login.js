"use client";
import { useState } from 'react';
import {auth} from '/firebase.config.js';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async event => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          required
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          required
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          placeholder="Password"
        />
        <button type="submit">Log in</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
