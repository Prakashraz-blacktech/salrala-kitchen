import { db } from "@/config/firebase.config";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  type DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

interface FetchKhanaParams {
  userId: string;
  pageSize: number;
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}

export const fetchUserKhana = async ({
  userId,
  pageSize,
  lastDoc,
}: FetchKhanaParams) => {
  try {
    let q = query(
      collection(db, "khanas"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);

    const khanas = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });

    const newLastDoc = snapshot.docs[snapshot.docs.length - 1];

    return {
      khanas,
      lastDoc: newLastDoc || null,
      hasMore: snapshot.docs.length === pageSize,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "failed-precondition" || error.message.includes("requires an index")) {
     
      return {
        khanas: [],
        lastDoc: null,
        hasMore: false,
        indexRequired: true, // custom flag to handle in UI
      };
    }

    return {
      khanas: [],
      lastDoc: null,
      hasMore: false,
    };
  }
};
