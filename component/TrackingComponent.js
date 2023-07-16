
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
    <div>      
        <div>{props.drugs}</div>
        <div>Did you take it ?</div>
        <div>        
          <input type='radio' name={props.seq} value={props.taken} defaultChecked={take === true}/>
          <label>Yes</label>
        </div>
        <div>        
          <input type='radio' name={props.seq} value={!props.taken} defaultChecked={take === false}/>
          <label>No</label>
        </div>
        <div>
          <label>Side Effect</label>
          <textarea></textarea>
        </div>
        <button type='button' onClick={btnSave}>Save</button>      
    </div>
  )
  }else{
    return(
    <></>
    )
  }
}
