"use client"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, updateDoc,setDoc, addDoc ,arrayUnion, Timestamp} from "firebase/firestore";
import { db } from "@/firebase/firebase.config";




export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState({ user_name : "loading"});
  const [id , setId] = useState("")
  const [pharaId, setPharaId] = useState("")

  //Later change the default value
  const [medicineName , setMedicineName] = useState("HAHAHA")
  const [scheduleToTake , setScheduleToTake] = useState(2)

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

  // Button Click eventListener
  const logsBtnClickAction = () => {

    const time = Timestamp.fromDate(new Date());

    const  handleSaveProfile = async () => {
      if(id){
        const userRef = doc(collection(db, "users"), id );
        let userUltimateData = []        

        for(let i = 0 ; i < scheduleToTake ; i ++){
          userUltimateData.push({                
            // later add the info
            sequenceNo: i,
            aliments : "aliments123",
            dosage : "dosage123",
            medicineName : medicineName,
            scheduleToTake : scheduleToTake,
            taken : false,
            sideEffect : false,
            time : time.toDate()
          
        })
        }

        console.log(userUltimateData)

        
          await setDoc(userRef, {prescriptionDetail : userUltimateData} , {merge: true}).then(
            () => window.location.href = "/prescription/track/" + id       
          )        
        
                        

        };        
      }     

      handleSaveProfile();
        
      
    }



  

  return (
    <div>      
      <div>
        <label>Name</label>        
        <input type="text" placeholder={user.user_name} readOnly/>
      </div>
      <div>
        <label>Medicine Name</label>        
        <input type="text" id="medicineName" value={medicineName} readOnly/>
      </div>
      <div>
        <label># a day</label>        
        <input type="text" id="scheduleToTake" value={scheduleToTake} readOnly/>
      </div>
      <div>
        <label>Tracking</label>        
        <input type="text" placeholder="" readOnly/>
      </div>
      <div>
        <label>Extra Notes</label>        
        <input type="text" placeholder="" readOnly/>
      </div>
      <div>        
        <button onClick={logsBtnClickAction}>Logs</button>
      </div>      
    </div>
  )
}




