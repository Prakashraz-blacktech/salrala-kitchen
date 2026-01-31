import { db } from "@/config/firebase.config";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { toast } from "sonner";

export const createStudent = async ({
  fullName,
  phoneNumber,
}: {
  fullName: string;
  phoneNumber: string;
}) => {
  try {
    const q = query(
      collection(db, "users"),
      where("phoneNumber", "==", phoneNumber)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return toast.error(
        "User with this phone number already exists, Please try with new one."
      );
    }

    async function transliterateRomanToNepaliSentence(sentence: string) {
      try {
        const words = sentence.trim().split(/\s+/);
        const results: string[] = [];

        for (const word of words) {
          if (!word) continue;

          const response = await fetch(
            `https://inputtools.google.com/request?text=${encodeURIComponent(
              word
            )}&itc=ne-t-i0-und&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`
          );
          const data = await response.json();
          results.push(data[1][0][1][0]);
        }

        console.log(results);
        return results.join(" ");
      } catch (error) {
        console.error("Transliteration error:", error);
        return sentence;
      }
    }

    const docRef = await addDoc(collection(db, "users"), {
      fullName,
      phoneNumber,
      outstandingAmount: 0,
      role: "STUDENT",
      devnagariName: await transliterateRomanToNepaliSentence(fullName),
    });

    const savedDoc = await getDoc(doc(db, "users", docRef.id));

    if (!savedDoc.exists()) {
      throw new Error("Failed to fetch saved student");
    }

    return {
      id: savedDoc.id,
      role: savedDoc.data().role,
      success: true,
      message: "User created successfully!",
    };
  } catch (error) {
    console.error("Create student error:", error);
    toast.error("Something went wrong");
    return error;
  }
};
