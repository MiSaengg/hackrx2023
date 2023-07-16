import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase/firebase.config";
import "../public/styles.css";
import Link from "next/link";

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [searchField, setSearchField] = useState("");
  const uid = auth.currentUser?.uid;

  const fetchLogs = async () => {
    let unsubscribe;
    if (uid && searchField !== "") {
      const usersQuery = query(
        collection(db, "users"),
        where("email", "==", searchField)
      );
      const querySnapshot = await getDocs(usersQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userUid = userDoc.id;

        if (typeof userUid === "string" && userUid !== "") {
          const recordsRef = doc(db, "users", userUid);

          unsubscribe = onSnapshot(recordsRef, (docSnap) => {
            if (docSnap.exists()) {
              const recordsData = docSnap.data();
              const logs = recordsData.prescriptionDetail.map((log) => {
                if (log.time && log.time.seconds && log.time.nanoseconds) {
                  const timestamp = new Date(
                    log.time.seconds * 1000 + log.time.nanoseconds / 1000000
                  );
                  const formattedTime = timestamp.toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                  });
                  return {
                    ...log,
                    time: formattedTime,
                  };
                }
                return log;
              });
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

    return () => unsubscribe && unsubscribe();
  };

  useEffect(() => {
    fetchLogs();
  }, [uid, searchField]);

  const handleReset = () => {
    setSearchField("");
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
          <h1 className="text-2xl font-bold mb-4">Logs</h1>
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              placeholder="Search by Email..."
              className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={fetchLogs}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Search
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Reset
            </button>
          </div>
          <div className="flex items-center space-x-5 my-4 p-4">  
            {logs.length > 0 ? (
              <ul className="list-none">
                {logs.map((log, index) => (
                  <li key={index} className="mb-4">
                    <div className="pl-4 border border-gray-300 rounded-lg shadow-md">
                      {Object.entries(log).map(([key, value]) => {
                        return (
                          <div key={key} className="mx-3 my-3">
                            <span className="font-semibold">{key}: </span>
                            <span>{JSON.stringify(value)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No logs available.</p>
            )}
          </div>
        </div>
        <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"></div>
      </div>
    </main>
  );
};

export default LogsPage;
