import { db } from "@/config/firebase.config";
import { doc, getDoc } from "firebase/firestore";

/**
 * Fetch user by ID
 */
export const getUserById = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    return userSnap.data();
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
};
