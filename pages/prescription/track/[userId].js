import { useRouter } from 'next/router';
import React from 'react'

export default function Page() {
  
  const router = useRouter();
  const [user, setUser] = useState({ user_name : "loading"});

  
  useEffect(() => {
    if( !router.isReady ) {      
      return;
    }
    const idParam = router.query.id
    const id = idParam[0]
    setId(id)

    //Use it later
    const phara_id = idParam[1]
    // setPharaId(phara_id)
    
    
    const fetchUserData = async () => {
      if (id) {
        const userRef = doc(collection(db, "users"), id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUser(userData);
          
        }
      }
    };

    fetchUserData();
  }, [router.isReady]);


  return (
    <div>Medication Task</div>
  )
}
