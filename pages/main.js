import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase/firebase.config";
import withAuth from "../firebase/withAuth";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import "../public/styles.css";

const Prescribe = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/prescription");
  };

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleButtonClick}
    >
      Prescribe
    </button>
  );
};

const MainPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const uid = auth.currentUser?.uid;

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/");
  };

  const handleViewLogs = () => {
    router.push("/logs");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (uid) {
        const userRef = doc(collection(db, "users"), uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUser(userData);
        }
      }
    };

    fetchUserData();
  }, [uid]);

  const handleSaveProfile = async (
    name,
    gender,
    dateOfBirth,
    allergies,
    currentMedications,
    licenseNumber,
    address
  ) => {
    if (uid) {
      const userRef = doc(collection(db, "users"), uid);
      let userData = {};

      if (user && user.roles.includes("viewer")) {
        userData = {
          name: name,
          gender: gender,
          dateOfBirth: dateOfBirth,
          allergies: allergies,
          currentMedications: currentMedications,
        };
      } else if (user && user.roles.includes("admin")) {
        userData = {
          name: name,
          licenseNumber: licenseNumber,
          address: address,
        };
      }

      await updateDoc(userRef, userData);

      setUser({
        ...user,
        ...userData,
      });
    }
  };

  if (
    !user ||
    (user &&
      user.roles &&
      ((user.roles.includes("admin") &&
        (!user.name || !user.licenseNumber || !user.address)) ||
        (user.roles.includes("viewer") &&
          (!user.name ||
            !user.gender ||
            !user.dateOfBirth ||
            !user.allergies ||
            !user.currentMedications))))
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="z-10 w-full max-w-lg px-32 py-32 bg-white shadow-md rounded-lg flex flex-col justify-center font-mono text-lg">
          <h1 className="text-xl font-bold mb-4">Complete Your Profile</h1>
          <>
            <label>
              Full Name:
              <input type="text" id="name-input" className="outlined-input" />
            </label>
            {user && user.roles && user.roles.includes("admin") ? (
              <>
                <label>
                  License Number:
                  <input
                    type="text"
                    id="license-input"
                    className="outlined-input"
                  />
                </label>
                <label>
                  Address:
                  <input
                    type="text"
                    id="address-input"
                    className="outlined-input"
                  />
                </label>
              </>
            ) : (
              <>
                <label>
                  Gender:
                  <select id="gender-input" className="outlined-input">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label>
                  Date of Birth:
                  <input
                    type="date"
                    id="dob-input"
                    className="outlined-input"
                  />
                </label>
                <label>
                  Allergies:
                  <input
                    type="text"
                    id="allergies-input"
                    className="outlined-input"
                    placeholder="N/A"
                  />
                </label>
                <label>
                  Current Medications:
                  <input
                    type="text"
                    id="medications-input"
                    className="outlined-input"
                    placeholder="N/A"
                  />
                </label>
              </>
            )}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => {
                const name = document.getElementById("name-input").value;
                const licenseNumber =
                  document.getElementById("license-input")?.value;
                const address = document.getElementById("address-input")?.value;
                const gender = document.getElementById("gender-input")?.value;
                const dateOfBirth = document.getElementById("dob-input")?.value;
                const allergies =
                  document.getElementById("allergies-input")?.value;
                const currentMedications =
                  document.getElementById("medications-input")?.value;
                handleSaveProfile(
                  name,
                  gender,
                  dateOfBirth,
                  allergies,
                  currentMedications,
                  licenseNumber,
                  address
                );
              }}
            >
              Save Profile
            </button>
          </>
        </div>
        <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"></div>
      </div>
    );
  }

  if (user.roles.includes("admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="z-10 w-full max-w-lg px-32 py-32 bg-white shadow-md rounded-lg flex flex-col justify-center font-mono text-lg">
          <h1 className="text-3xl font-bold mb-4">Main Page</h1>
          <p>Welcome, {user.name}!</p>
          {user.address && <p>Address: {user.address}</p>}
          {user.licenseNumber && <p>License Number: {user.licenseNumber}</p>}
          <Prescribe />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleViewLogs}
          >
            Logs
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleLogout}
          >
            Logout
          </button>
          <br />
        </div>
        <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"></div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="z-10 w-full max-w-lg px-32 py-32 bg-white shadow-md rounded-lg flex flex-col justify-center font-mono text-lg">
          <h1 className="text-3xl font-bold mb-4">Main Page</h1>
          <p>Welcome, {user.name}!</p>
          <p>Gender: {user.gender}</p>
          <p>Date of Birth: {user.dateOfBirth}</p>
          <p>Allergies: {user.allergies || "N/A"}</p>
          <p>Current Medications: {user.currentMedications || "N/A"}</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"></div>
      </div>
    );
  }
};

export default withAuth(MainPage);
