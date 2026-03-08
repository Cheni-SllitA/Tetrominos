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

export const updateHighScore = async (uid, newScore) => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const currentHigh = docSnap.data().highScore || 0;
    // Only update if new score is higher
    if (newScore > currentHigh) {
      await updateDoc(userRef, { highScore: newScore });
    }
  }
};