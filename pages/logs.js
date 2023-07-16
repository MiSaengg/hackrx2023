import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/firebase.config";

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [searchField, setSearchField] = useState("");
  const uid = auth.currentUser?.uid;

  const fetchLogs = async () => {
    let find;
    if (uid && searchField !== "") {
      const usersQuery = query(collection(db, "users"), where("email", "==", searchField));
      const querySnapshot = await getDocs(usersQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userUid = userDoc.id;
        console.log(userUid);

        if (typeof userUid === 'string' && userUid !== '') {
          const recordsRef = doc(db, "users", userUid);

          find = onSnapshot(recordsRef, (docSnap) => {
            if (docSnap.exists()) {
              const recordsData = docSnap.data();
              const logs = recordsData.prescriptionDetail;
              setLogs(logs);
            } else {
              setLogs([]);
            }
          });
        } else {
          setLogs([]);
        }
      }
    }

    return () => find && find();
  };

  useEffect(() => {
    fetchLogs();
  }, [uid, searchField]);

  const handleReset = () => {
    setSearchField("");
  };

  return (
    <div>
      <h1>Logs</h1>
      <div>
        <input
          type="text"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          placeholder="Search by Email..."
        />
        <button onClick={fetchLogs}>Search</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      {logs.length > 0 ? (
        <ul>
          {logs.map((log, index) => (
            <li key={index}>
              <pre>{JSON.stringify(log, null, 2)}</pre>
            </li>
          ))}
        </ul>
      ) : (
        <p>No logs available.</p>
      )}
    </div>
  );
};

export default LogsPage;
