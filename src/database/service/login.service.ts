import { toast } from "sonner";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { createActivity } from "./activity.service";
import { ADToBS } from "bikram-sambat-js";

export const login = async (phoneNumber: string) => {
  try {
    if (!phoneNumber) {
      toast("Phone number is required");
      return;
    }
    const q = query(
      collection(db, "users"),
      where("phoneNumber", "==", phoneNumber)
    );

    const querySnapshot = await getDocs(q);
    const nepaliDate = ADToBS(new Date());

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      await createActivity({
        userId: doc.id,
        title: "User Login",
        description: "Logged in successfully",
        date: nepaliDate,
      });
      return {
        success: true,
        id: doc.id,
        role:doc.data().role,
        fullName:doc.data().fullName,
        phoneNumber:doc.data().phoneNumber,
        message:"User login successfully."
      };
    } else {
        toast.error("User not found");
      return { success: false, message: "User not found" };
    }
  } catch (error) {
    toast.error("Something went wrong");
    return error;
  }
};
