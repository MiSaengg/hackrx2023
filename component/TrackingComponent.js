
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { collection, doc, getDoc, updateDoc, setDoc, query } from "firebase/firestore";
import { db } from "@/firebase/firebase.config";

export default function TrackingComponent(props) {
  const [take , setTake] = useState(props.taken);
  const id = props.userId
  let userData = [];
  let originalData = []


  const btnSave = async () => {
    if (id) {
      const useRef = doc(collection(db, "users"), id);
      
      const userSnap = await getDoc(useRef);
      console.log(userSnap);
    
      if(userSnap.exists()){
        console.log(userSnap.data())
        
      }
    
    }
  }


  if(!props.taken){    
  return (    
    <div className="z-10 w-3 flex flex-col items-center justify-center font-mono text-sm border-2 p-10 my-3 rounded" >    
        <div className="z-10 w-full max-w-5xl flex flex-col items-center justify-center font-mono text-lg">
          {props.drugs}
        </div>
        <div className="z-10 w-full max-w-5xl flex flex-col items-center justify-center font-mono text-sm">
          Did you take it ?
        </div>
        <div className="z-10 w-full max-w-5xl flex flex-row items-center justify-evenly font-mono text-sm">
          <input type='radio' name={props.seq} value={props.taken} defaultChecked={take === true}/>
          <label>Yes</label>
          <input type='radio' name={props.seq} value={!props.taken} defaultChecked={take === false}/>
          <label>No</label>          
        </div>
        
        
        <div className="z-10 w-full max-w-5xl flex flex-col items-center justify-center font-mono text-sm">      
          <label>Any Side Effect ? </label>
        </div>
        <div className="z-10 w-full max-w-5xl flex flex-col items-center justify-center font-mono text-lg">
          <textarea></textarea>
        </div>  
        <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-4 sm:py-4 sm:px-8">        
          <button type='button' onClick={btnSave}>Save</button>      
        </div>
    </div>
  )
  }else{
    return(
    <></>
    )
  }
}
