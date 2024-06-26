import React, { createContext, useEffect, useState, useContext } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import Loader from '../Components/Loader';

const AuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log(' CURRENT USER ', currentUser);
      if (currentUser) {
        const userSnapshot = await getDocs(
          query(collection(db, 'User'), where('uuid', '==', currentUser.uid))
        );
        const userData = userSnapshot.docs[0]?.data();
        setUserData(userData);
      } else {
        setUserData(null);
      }
      setLoading(false); // Set loading to false after initial user data is set or user is logged out
    });

    return unsubscribe;
  }, []);

  function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logoutUser() {
    return signOut(auth);
  }

  if (loading) {
    return <Loader></Loader>; // Display a loading indicator while user data is being fetched
  }

  return (
    <AuthContext.Provider value={{ userData, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(AuthContext);
}
