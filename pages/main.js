import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../firebase/firebase.config';
import withAuth from '../firebase/withAuth';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

const MainPage = () => {
  const router = useRouter();
  const [roles, setRoles] = useState([]);
  const uid = auth.currentUser?.uid;

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (uid) {
        const userRef = doc(collection(db, 'users'), uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setRoles(userData.roles);
        }
      }
    };

    fetchUserRoles();
  }, [uid]);

  return (
    <div>
      <h1>Main Page</h1>
      <p>This is the main page after login.</p>
      <p>User Role: {roles}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default withAuth(MainPage);
