import { useEffect, useState } from "react";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase/firebase.config";

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [searchField, setSearchField] = useState("");
  const uid = auth.currentUser?.uid;

  const fetchLogs = async () => {
    if (uid && searchField !== "") {
      const usersQuery = query(collection(db, "users"), where("email", "==", searchField));
      const querySnapshot = await getDocs(usersQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userUid = userDoc.data().uid;

        if (typeof userUid === 'string' && userUid !== '') {
          const recordsRef = collection(db, `records/${userUid}`);
          const recordsSnap = await getDocs(recordsRef);

          if (!recordsSnap.empty) {
            const recordsData = recordsSnap.docs[0].data();
            const logs = recordsData.prescriptionDetail;
            setLogs(logs);
          } else {
            setLogs([]);
          }
        } else {
          console.error('UID is not a string or is an empty string:', userUid);
          setLogs([]);
        }
      } else {
        setLogs([]);
      }
    }
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
