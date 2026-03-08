import { db } from "./firebase";
import { doc, setDoc, updateDoc, increment } from "firebase/firestore";
import { auth } from "./firebase";

export const updateUserScore = async (score) => {
  const user = auth.currentUser;

  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  await setDoc(
    userRef,
    {
      email: user.email,
      score: score,
      updatedAt: new Date(),
    },
    { merge: true }
  );
};