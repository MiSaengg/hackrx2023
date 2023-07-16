import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withAuth from "../firebase/withAuth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase/firebase.config";
import ReactModal from "react-modal";
import { arrayUnion } from "firebase/firestore";
import { setDoc } from "firebase/firestore";
import "../public/styles.css";
import Link from "next/link";

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
  const [searchResults, setSearchResults] = useState([]);
  const [emailExists, setEmailExists] = useState(false);

  const handleSend = () => {
    if (emailExists) {
      setIsModalOpen(true);
    }
    if (!emailExists) {
      alert("User does not exist");
      return;
    }
  };

  const handleEmailSend = async () => {
    const usersQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(usersQuery);

    if (querySnapshot.empty) {
      alert("User does not exist");
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const emailUserId = userDoc.id;
    const currentUserId = auth.currentUser?.uid;

    const prescriptionData = {
      Email: email,
      Pharmacist: userName,
      "License Number": licenseNumber,
      Address: address,
      "e-Signature": eSignature,
      Aliment: selectedAliment,
      Drug: selectedDrug,
      Dosage: dosage,
      "Times Per Day": timesPerDay,
      "Additional Info": additionalInfo,
      Date: new Date().toLocaleDateString(),
    };

    if (!eSignature) {
      alert("Please provide your e-Signature");
      return;
    }

    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prescriptionData),
    });

    if (response.ok) {

      const userRecordsRef = doc(collection(db, "records"), currentUserId);

      await setDoc(
        userRecordsRef,
        {
          [emailUserId]: arrayUnion(prescriptionData),
        },
        { merge: true }
      );
      window.alert("Email sent successfully");
      setIsModalOpen(false);
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

  const handleEmailChange = async (e) => {
    setEmail(e.target.value);

    const usersQuery = query(
      collection(db, "users"),
      where("email", "==", e.target.value)
    );
    const querySnapshot = await getDocs(usersQuery);

    const usersList = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      data.id = doc.id;
      usersList.push(data);
    });

    setSearchResults(usersList);
    setEmailExists(usersList.length > 0);
  };

  return (
    <main className="flex flex-col items-center justify-center">
      <Link href="/main">
        <div className="flex items-center justify-center p-6 md:p-24">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back
        </div>
      </Link>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-lg px-8 py-8 bg-white shadow-md rounded-lg flex flex-col justify-center font-mono text-lg">
          <h1 className="text-2xl font-bold mb-4">Prescription Page</h1>

          <input
            list="email-suggestions"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
            className="outlined-input"
          />

          <datalist id="email-suggestions">
            {searchResults.map((user, index) => (
              <option key={index} value={user.email}>
                {user.email}
              </option>
            ))}
          </datalist>

          <select onChange={handleAlimentChange} className="outlined-input">
            {aliments.map((aliment, index) => (
              <option key={index} value={aliment.id}>
                {aliment.id}
              </option>
            ))}
          </select>

          <select
            value={selectedDrug}
            onChange={handleDrugChange}
            className="outlined-input"
          >
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
            className="outlined-input"
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
            className="outlined-input"
          />

          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Additional Information"
            className="outlined-input"
          />

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleSend}
          >
            Send
          </button>

          <ReactModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            ariaHideApp={false}
          >
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-full max-w-lg px-8 py-8 bg-white shadow-md rounded-lg flex flex-col justify-center font-mono text-lg">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-right font-bold"
                >
                  X
                </button>
                <h2>Confirmation</h2>
                <p>Pharmacist: {userName}</p>
                <p>License Number: {licenseNumber}</p>
                <p>Address: {address}</p>

                <input
                  type="text"
                  value={eSignature}
                  onChange={(e) => setESignature(e.target.value)}
                  placeholder="e-Signature"
                  className="outlined-input"
                  required
                />

                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                  onClick={handleEmailSend}
                >
                  Send Email
                </button>
              </div>
              <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"></div>
            </div>
          </ReactModal>
        </div>
        <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"></div>
      </div>
    </main>
  );
};

export default withAuth(PrescriptionPage);
