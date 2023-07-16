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
  const [record, setRecord] = useState({});
  //Later change the default value
  const [medicineName , setMedicineName] = useState("loading")
  const [scheduleToTake , setScheduleToTake] = useState("loading")
  const [dosage , setDosage] = useState("loading")
  const [aliment, setAliment] = useState("loading")
  useEffect(() => {
    if( !router.isReady ) {      
      return;
    }
    const idParam = router.query.id
    const id = idParam[0]
    setId(id)

    //Use it later
    const phara_id = idParam[1]
    setPharaId(phara_id)
    
    
    const fetchUserData = async () => {
      if (id) {
        const userRef = doc(collection(db, "users"), id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUser(userData);          
          
        }
      }

      if(pharaId){
        // const userRef = doc(collection(db,"records") , pharaId);
        const userRef = doc(collection(db, "records"), pharaId);
        const userSnap = await getDoc(userRef);

        if(userSnap.exists()){
          const userData = userSnap.data();
          console.log(userData)
          const certainUserData = userData[id]
          const ultimateCertainUser = certainUserData[0]
          setRecord(ultimateCertainUser)
          setMedicineName(ultimateCertainUser["Drug"]);
          setScheduleToTake(ultimateCertainUser["Times Per Day"])
          setAliment(ultimateCertainUser["Aliment"])
          setDosage(ultimateCertainUser["Dosage"])
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
            aliments : aliment,
            dosage : dosage,
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
        <input type="text" id="medicineName" value={medicineName || ""} readOnly/>
      </div>
      <div>
        <label># a day</label>        
        <input type="text" id="scheduleToTake" value={scheduleToTake || ""} readOnly/>
      </div>
      <div>        
        <button onClick={logsBtnClickAction}>Tracking</button>
      </div>
      <div>
        <label>Extra Notes</label>        
        <input type="text" placeholder="" readOnly/>
      </div>      
    </div>
  )
}




