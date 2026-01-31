/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/config/firebase.config";
import {
  collection,
  getDocs,
  limit,
  query,
  startAfter,
  where,
} from "firebase/firestore";

type PaymentParams = {
  userId: string;
  pageSize: number;
  lastDoc?: any;
};

export const fetchPayments = async ({
  userId,
  pageSize,
  lastDoc,
}: PaymentParams) => {
  try {
    let q = query(
      collection(db, "payments"),
      where("userId", "==", userId),
      limit(pageSize)
    );

    // Apply pagination
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);

    const payments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const newLastDoc = snapshot.docs[snapshot.docs.length - 1];

    return {
      payments,
      lastDoc: newLastDoc || null,
      hasMore: snapshot.docs.length === pageSize,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Failed to fetch activity logs:", error);

    // Firestore asks for an index
    if (
      error.code === "failed-precondition" ||
      error.message.includes("requires an index")
    ) {
      return {
        payments: [],
        lastDoc: null,
        hasMore: false,
        indexRequired: true, // same as your khana code
      };
    }

    return {
      PaymentResponse: [],
      lastDoc: null,
      hasMore: false,
    };
  }
};
