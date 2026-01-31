/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";

export const getMe = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        userId: docSnap.id,
        fullName: docSnap.data().fullName,
        phoneNumber: docSnap.data().phoneNumber,
        outstandingAmount: docSnap.data().outstandingAmount,
      };
    } else {
      toast.error("User not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    toast.error("Failed to fetch user");
    return null;
  }
};

import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  type DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

interface FetchUsersParams {
  pageSize: number;
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}

interface FetchUsersResult {
  users: any[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

export const allUsers = async ({
  pageSize,
  lastDoc,

}: FetchUsersParams): Promise<FetchUsersResult> => {
  try {
    let q = query(
      collection(db, "users"),
      orderBy("outstandingAmount", "desc"),
      
      
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const newLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

    return {
      users,
      lastDoc: newLastDoc,
      hasMore: snapshot.docs.length === pageSize,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Failed to fetch users:", error);

    if (
      error.code === "failed-precondition" ||
      error.message.includes("requires an index")
    ) {
      return {
        users: [],
        lastDoc: null,
        hasMore: false,
      };
    }

    return {
      users: [],
      lastDoc: null,
      hasMore: false,
    };
  }
};

