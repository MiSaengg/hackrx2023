import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withAuth from "../firebase/withAuth";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db, auth } from "../firebase/firebase.config";
import ReactModal from "react-modal";
import { arrayUnion } from "firebase/firestore";
import { setDoc } from "firebase/firestore";

const PrescriptionPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [aliments, setAliments] = useState([]);
  const [selectedAliment, setSelectedAliment] = useState("");
  const [selectedDrug, setSelectedDrug] = useState("");
  const [specifiedDrugs, setSpecifiedDrugs] = useState([]);
  const [dosage, setDosage] = useState("");
  const [timesPerDay, setTimesPerDay] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [address, setAddress] = useState("");
  const [eSignature, setESignature] = useState("");

  const handleSend = () => {
    setIsModalOpen(true);
  };

  const handleEmailSend = async () => {
    const prescriptionData = {
      Email: email,
      Pharmacist: userName,
      "License Number": licenseNumber,
      Address: address,
      "E-Signature": eSignature,
      Aliment: selectedAliment,
      Drug: selectedDrug,
      Dosage: dosage,
      "Times Per Day": timesPerDay,
      "Additional Info": additionalInfo,
    };
  
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prescriptionData),
    });
  
    if (response.ok) {
      console.log("Email sent successfully");
      
      // add the prescription to the records collection
      const uid = auth.currentUser?.uid;
      const recordsRef = doc(collection(db, "records"), uid);
      
      // push the prescription into the 'log' array field
      await setDoc(recordsRef, {
        log: arrayUnion(prescriptionData),
      }, { merge: true });
      
    } else {
      const errorData = await response.json();
      console.error(errorData.message);
    }
  };
  
  

  useEffect(() => {
    const checkAdminRole = async () => {
      const uid = auth.currentUser?.uid;
      const userRef = doc(collection(db, "users"), uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const isAdmin = userData.roles.includes("admin");

        if (!isAdmin) {
          router.push("/main");
        }
      }
    };

    const fetchAliments = async () => {
      const alimentsQuery = query(collection(db, "aliments"));
      const querySnapshot = await getDocs(alimentsQuery);

      const alimentsList = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        data.id = doc.id;
        alimentsList.push(data);
      });

      setAliments(alimentsList);
    };

    const fetchUserData = async () => {
      const uid = auth.currentUser?.uid;
      const userRef = doc(collection(db, "users"), uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUserName(userData.name);
        setLicenseNumber(userData.licenseNumber);
        setAddress(userData.address);
      }
    };

    checkAdminRole();
    fetchAliments();
    fetchUserData();
  }, []);

  const handleAlimentChange = (event) => {
    setSelectedAliment(event.target.value);
    const selectedAlimentObject = aliments.find(
      (aliment) => aliment.id === event.target.value
    );
    if (selectedAlimentObject) {
      setSpecifiedDrugs(selectedAlimentObject.specifiedDrugs);
    } else {
      setSpecifiedDrugs([]);
    }
  };

  const handleDrugChange = (event) => {
    setSelectedDrug(event.target.value);
  };

  return (
    <div>
      <h1>Prescription Page</h1>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <select onChange={handleAlimentChange}>
        {aliments.map((aliment, index) => (
          <option key={index} value={aliment.id}>
            {aliment.id}
          </option>
        ))}
      </select>

      <select value={selectedDrug} onChange={handleDrugChange}>
        {specifiedDrugs.map((drug, index) => (
          <option key={index} value={drug}>
            {drug}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={dosage}
        onChange={(e) => setDosage(e.target.value)}
        placeholder="Dosage"
      />

      <input
        type="number"
        value={timesPerDay}
        onChange={(e) => {
          if (e.target.value < 1) {
            setTimesPerDay(1);
          } else {
            setTimesPerDay(e.target.value);
          }
        }}
        placeholder="Number of times per day"
        min="1"
      />

      <textarea
        value={additionalInfo}
        onChange={(e) => setAdditionalInfo(e.target.value)}
        placeholder="Additional Information"
      />

      <button onClick={handleSend}>Send</button>

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        ariaHideApp={false}
      >
        <button onClick={() => setIsModalOpen(false)}>X</button>
        <h2>Confirmation</h2>
        <p>Pharmacist: {userName}</p>
        <p>License Number: {licenseNumber}</p>
        <p>Address: {address}</p>

        <input
          type="text"
          value={eSignature}
          onChange={(e) => setESignature(e.target.value)}
          placeholder="E-Signature"
        />

        <button onClick={handleEmailSend}>Send Email</button>
      </ReactModal>
    </div>
  );
};

export default withAuth(PrescriptionPage);
