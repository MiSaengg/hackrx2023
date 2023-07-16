import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase/firebase.config";
import withAuth from "../firebase/withAuth";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

const Prescribe = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/prescription");
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Prescribe</button>
    </div>
  );
};

const MainPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const uid = auth.currentUser?.uid;

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/");
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
    currentMedications
  ) => {
    if (uid) {
      const userRef = doc(collection(db, "users"), uid);
      let userData = {};

      if (user.roles.includes("viewer")) {
        userData = {
          name: name,
          gender: gender,
          dateOfBirth: dateOfBirth,
          allergies: allergies,
          currentMedications: currentMedications,
        };
      }

      await updateDoc(userRef, userData);

      setUser({
        ...user,
        name: name,
        gender: gender,
        dateOfBirth: dateOfBirth,
        allergies: allergies,
        currentMedications: currentMedications,
      });
    }
  };

  if (
    !user ||
    (user &&
      user.roles.includes("viewer") &&
      (!user.name ||
        !user.gender ||
        !user.dateOfBirth ||
        !user.allergies ||
        !user.currentMedications))
  ) {
    return (
      <div>
        <h1>Complete Your Profile</h1>
        {user && user.roles.includes("viewer") && (
          <>
            <label>
              Full Name:
              <input type="text" id="name-input" />
            </label>
            <label>
              Gender:
              <select id="gender-input">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label>
              Date of Birth:
              <input type="date" id="dob-input" />
            </label>
            <label>
              Allergies:
              <input type="text" id="allergies-input" placeholder="N/A" />
            </label>
            <label>
              Current Medications:
              <input type="text" id="medications-input" placeholder="N/A" />
            </label>
            <button
              onClick={() => {
                const name = document.getElementById("name-input").value;
                const gender = document.getElementById("gender-input").value;
                const dateOfBirth = document.getElementById("dob-input").value;
                const allergies =
                  document.getElementById("allergies-input").value;
                const currentMedications =
                  document.getElementById("medications-input").value;
                handleSaveProfile(
                  name,
                  gender,
                  dateOfBirth,
                  allergies,
                  currentMedications
                );
              }}
            >
              Save Profile
            </button>
          </>
        )}
      </div>
    );
  }

  if (user.roles.includes("admin")) {
    return (
      <div>
        <h1>Main Page</h1>
        <p>This is the main page for admin users.</p>
        <p>Welcome, {user.name}!</p>
        {user.address && <p>Address: {user.address}</p>}
        {user.licenseNumber && <p>License Number: {user.licenseNumber}</p>}
        <Prescribe />
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Main Page</h1>
        <p>This is the main page for viewer users.</p>
        <p>Welcome, {user.name}!</p>
        <p>Gender: {user.gender}</p>
        <p>Date of Birth: {user.dateOfBirth}</p>
        <p>Allergies: {user.allergies || "N/A"}</p>
        <p>Current Medications: {user.currentMedications || "N/A"}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }
};

export default withAuth(MainPage);
