import { useRouter } from 'next/router';

import React, { useState , useEffect } from 'react'
import { collection, doc, getDoc, updateDoc,setDoc, addDoc ,arrayUnion, Timestamp} from "firebase/firestore";
import { db } from "@/firebase/firebase.config";
import TrackingComponent from '@/component/TrackingComponent';
import "@/public/styles.css"

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
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">      
      <div className="z-10 w-full max-w-xl flex flex-row items-center justify-center font-mono text-xl">    
        Medication Notification
      </div>

      <div className="z-10 w-full max-w-5xl flex flex-col items-center justify-center font-mono text-sm my-10">    
        {prescription.map((detail , i) => {
          
          return(            
            <TrackingComponent key={i} drugs={detail.medicineName} seq={detail.sequenceNo} taken={detail.taken} userId={id}/>
          )
        })}
        
      </div>
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"></div>
    </main>  
  )
}
