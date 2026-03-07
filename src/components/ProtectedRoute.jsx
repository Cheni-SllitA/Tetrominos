import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined = still checking

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // null if not logged in, user object if logged in
    });
    return () => unsubscribe(); // cleanup listener on unmount
  }, []);

  if (user === undefined) return <div>Loading...</div>; // still checking auth
  if (user === null) return <Navigate to="/login" replace />; // not logged in
  return children; // logged in, render the component
};

export default ProtectedRoute;