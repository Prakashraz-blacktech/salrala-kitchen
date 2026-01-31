import { db } from "@/config/firebase.config";
import { collection, addDoc, getDocs, limit, orderBy, where, query, startAfter, QueryDocumentSnapshot, type DocumentData, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

export const createActivity = async ({
  userId,
  title,
  description,
  date,
}: {
  userId: string;
  title: string;
  description: string;
  date: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, "activities"), {
      userId,
      title,
      description,
      date,
      createdAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      userId,
      title,
      description,
      date,
    };
  } catch (error) {
    toast.error("Failed to create activity log");
    return error;
  }
};


interface FetchActivityParams {
  userId: string;
  pageSize: number;
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}

export const fetchActivityLogs = async ({
  userId,
  pageSize,
  lastDoc,
}: FetchActivityParams) => {
  try {
    let q = query(
      collection(db, "activities"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    // Apply pagination
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);

    const activityLog = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const newLastDoc = snapshot.docs[snapshot.docs.length - 1];

    return {
      activityLog,
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
        activityLog: [],
        lastDoc: null,
        hasMore: false,
        indexRequired: true, // same as your khana code
      };
    }

    return {
      activityLog: [],
      lastDoc: null,
      hasMore: false,
    };
  }
};



