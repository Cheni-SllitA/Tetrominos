//authentication service
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

//register user function
export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
};