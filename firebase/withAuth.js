import {onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { auth } from '../firebase/firebase.config';

const withAuth = (Component) => {
  return (props) => {
    const Router = useRouter();
    const [verified, setVerified] = useState(false);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user){
          console.log(user)
          setVerified(true);
        } else {
          Router.push("/index");
        }
      });

      return () => unsubscribe();
    }, []);

    if (verified) {
      return <Component {...props} />;
    } else {
      return null;
    }
  };
};

export default withAuth;
