//create user in the database
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

export const createUserProfile = async (user, username) => {
  await setDoc(doc(db, "users", user.uid), {
    username: username,
    email: user.email,
    createdAt: new Date(),
    hearts: 3,
    highScore: 0
  });
};