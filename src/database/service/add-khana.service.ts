import { db } from "@/config/firebase.config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "sonner";
import { ADToBS } from "bikram-sambat-js";

export const createKhana = async ({
  userId,
  quantity,
  addOns = [],
}: {
  userId: string;
  quantity: number;
  shift?: string;
  date?: string;
  addOns?: { name: string; quantity: number; price: number }[];
}) => {
  try {
    if (!userId || !quantity) {
      toast.error("Please provide valid data");
      return;
    }

    const nepalTimeOptions = { timeZone: "Asia/Kathmandu", hour12: false };
    const currentTime = new Date().toLocaleString("en-US", nepalTimeOptions);
    const currentHour = parseInt(currentTime.split(",")[1].split(":")[0]);
    const shift = currentHour >= 6 && currentHour < 14 ? "morning" : "evening";

    const nepaliDate = ADToBS(new Date());

    
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      toast.error("User not found");
      return;
    }

    const user = userSnap.data();

    // Check if khana already added for this date/shift
    const existingSnap = await getDocs(
      query(
        collection(db, "khanas"),
        where("userId", "==", userId),
        where("date", "==", nepaliDate),
        where("shift", "==", shift)
      )
    );

    if (!existingSnap.empty) {
      const existingDoc = existingSnap.docs[0].data();
      const createdAt = existingDoc.createdAt?.toDate
        ? existingDoc.createdAt.toDate()
        : new Date(existingDoc.createdAt);

      const now = new Date();
      const diffMs = now.getTime() - createdAt.getTime();
      const diffMinutes = Math.floor(diffMs / 1000 / 60);
      const diffHours = Math.floor(diffMinutes / 60);

      const timeAgo = diffHours > 0 ? `${diffHours} hour${diffHours > 1 ? "s" : ""} ago` : `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;

      toast.error(`You already added khana for ${shift} shift ${timeAgo}`);
      return null;
    }

    const addOnsTotal = addOns.length > 0 ? addOns.reduce((acc, curr) => acc + Number(curr.price) * Number(curr.quantity), 0) : 0;
    const totalPrice = Number(quantity) * 120 + Number(addOnsTotal);

    await addDoc(collection(db, "khanas"), {
      userId,
      quantity,
      shift,
      date: nepaliDate,
      time: currentTime,
      createdAt: new Date(),
      updatedAt: new Date(),
      addOns,
      addedBy: user?.devnagariName || user?.fullName,
      totalPrice,
    });

    await updateDoc(userRef, {
      outstandingAmount: (user.outstandingAmount || 0) + totalPrice,
    });

    await addDoc(collection(db, "activities"), {
      userId,
      title: "Khana Added",
      description: `${user?.devnagariName || user?.fullName} added ${quantity} khana for ${shift} shift`,
      createdAt: new Date(),
      date: nepaliDate,
      type: "add",
      addedBy: user?.devnagariName || user?.fullName,
    });
    
    return {
      success: true,
      message: "Khana added successfully",
      totalPrice,
      newOutstanding: (user.outstandingAmount || 0) + totalPrice,
    };
  } catch (error) {
    console.error(error);
    toast.error("Failed to create khana record");
    return error;
  }
};
