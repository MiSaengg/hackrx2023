"use client"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, updateDoc,setDoc, addDoc ,arrayUnion, Timestamp} from "firebase/firestore";
import { db } from "@/firebase/firebase.config";
import "@/public/styles.css"



export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState({ user_name : "loading"});
  const [id , setId] = useState("")
  const [pharaId, setPharaId] = useState("")
  const [record, setRecord] = useState({});
  //Later change the default value
  const [medicineName , setMedicineName] = useState(null)
  const [scheduleToTake , setScheduleToTake] = useState(4)
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
        const userRef1 = doc(collection(db, "records"), pharaId);
        const userSnap1 = await getDoc(userRef1);

        if(userSnap1.exists()){
          const userData1 = userSnap1.data();
          console.log(userData1)
          const certainUserData = userData1[id]
          const ultimateCertainUser = certainUserData[0]
          setRecord(ultimateCertainUser)
          setMedicineName(ultimateCertainUser["Drug"]);
          setScheduleToTake(parseInt(ultimateCertainUser["Times Per Day"]))
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

    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">      
      <div className="z-10 w-full max-w-5xl flex flex-row items-center justify-center font-mono text-sm">        
        <label>Name</label>        
      </div>
      <div className="z-10 w-full max-w-5xl flex flex-row items-center justify-center font-mono text-lg">        
        {user.user_name} 
       </div> 
       
      <div className="z-10 w-full max-w-5xl flex flex-row items-center justify-center font-mono text-sm">
        <label>Medicine Name</label>        
      </div>
      <div className="z-10 w-full max-w-5xl flex flex-row items-center justify-center font-mono text-lg">
        {medicineName || "Calcium carbonate"}
      </div>
      <div className="z-10 w-full max-w-5xl flex flex-row items-center justify-center font-mono text-sm">
        <label># a day</label>        
      </div>      
      <div className="z-10 w-full max-w-5xl flex flex-row items-center justify-center font-mono text-lg">
        {scheduleToTake || 4}
      </div>

      <div className="z-10 w-full max-w-5xl flex flex-row items-center justify-center font-mono text-lg">
        <label>Extra Notes</label>        
      </div>      
      <div className="z-10 w-full max-w-5xl flex flex-row items-center justify-center font-mono text-lg">
        <input type="text" placeholder="" readOnly/>
      </div>
      <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded mt-4 sm:py-4 sm:px-8">        
        <button onClick={logsBtnClickAction}>Tracking</button>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"></div>
    </main>
  )
}




