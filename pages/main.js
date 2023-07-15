// pages/main.js

"use client";

import { useRouter } from 'next/router';
import withAuth from '../firebase/withAuth';

const MainPage = () => {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div>
      <h1>Main Page</h1>
      <p>This is the main page after login.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default withAuth(MainPage);
