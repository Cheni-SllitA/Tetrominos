//authentication service
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

//register user function
export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
};

//login user function
export const loginUser = async (email, password) => {
  await setPersistence(auth, browserSessionPersistence);

  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
};

// Logout user
export const logoutUser = async () => {
  await signOut(auth);
};
