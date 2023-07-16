
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { collection, doc, getDoc, updateDoc, getDocs, query } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

export default function TrackingComponent(props) {
  const [take , setTake] = useState("");
  const id = props.userId



  const trackSaveBtnClickAction = async () => {
    if (id) {
      const useRef = doc(collection(db , "users" , 
      "prescriptionDetail") ,uid);
      
      await updateDoc(useRef), {
        taken : true,
        sideEffect : ,
      }

      
    }
  }


  if(!props.taken){    
  return (    
    <div>
      <form>
        <div>{props.drugs}</div>
        <div>Did you take it ?</div>
        <div>        
          <input type='radio' name={props.seq} value={props.taken} checked={true}/>
          <label>Yes</label>
        </div>
        <div>        
          <input type='radio' name={props.seq} value={!props.taken}/>
          <label>No</label>
        </div>
        <div>
          <label>Side Effect</label>
          <textarea></textarea>
        </div>
        <button onClick={trackSaveBtnClickAction}>Save</button>
      </form>
    </div>
  )
  }else{
    return(
    <></>
    )
  }
}
