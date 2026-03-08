import { db } from "./firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export const getLeaderboard = async () => {
    const q = query(
        collection(db, "users"),
        orderBy("score", "desc"),
        limit(10)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc, index) => ({
        rank: index + 1,
        ...doc.data(),
    }));
};