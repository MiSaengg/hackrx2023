import { useRouter } from 'next/router';

import React, { useState , useEffect } from 'react'
import { collection, doc, getDoc, updateDoc,setDoc, addDoc ,arrayUnion, Timestamp} from "firebase/firestore";
import { db } from "@/firebase/firebase.config";
import TrackingComponent from '@/component/TrackingComponent';

export default function Page() {
  
  const router = useRouter();
  const [id , setId] = useState("")
  const [user, setUser] = useState({ user_name : "loading"});
  const [prescription, setPrescription] = useState([]);
  const [takenTime, setTakenTime] = useState(0);
  const [trackingArray, setTrackingArray] = useState([]);
  useEffect(() => {
    if( !router.isReady ) {      
      return;
    }
    const id = router.query.userId        
    setId(id)

    //Use it later
    // const phara_id = idParam[1]
    // setPharaId(phara_id)        
    const fetchUserData = async () => {
      if (id) {
        const userRef = doc(collection(db, "users"), id);
        const userSnap = await getDoc(userRef);
                
        if (userSnap.exists()) {
          const userData = userSnap.data();
          
          setUser(userData);          
          setPrescription(userData.prescriptionDetail)          
                            
          
        } 

      }
    };
    fetchUserData();
    
    
  }, [router.isReady]);
  
  

  return (
    <>
      <div>Medication Notification</div>

      <div>
        {prescription.map((detail , i) => {
          
          return(            
            <TrackingComponent key={i} drugs={detail.medicineName} seq={detail.sequenceNo} taken={detail.taken} userId={id}/>
          )
        })}
        
      </div>
    </>  
  )
}
