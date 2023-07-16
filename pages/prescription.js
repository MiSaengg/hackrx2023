import { useEffect } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../firebase/withAuth';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase.config';

const PrescriptionPage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAdminRole = async () => {
      const uid = auth.currentUser?.uid;
      const userRef = doc(collection(db, 'users'), uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const isAdmin = userData.roles.includes('admin');

        if (!isAdmin) {
          router.push('/main');
        }
      }
    };

    checkAdminRole();
  }, []);

  return (
    <div>
      <h1>Prescription Page</h1>
      {/* Your prescription page content */}
    </div>
  );
};

export default withAuth(PrescriptionPage);
