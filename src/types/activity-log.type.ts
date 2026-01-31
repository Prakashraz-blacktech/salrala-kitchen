import type { Timestamp } from "firebase/firestore";

export interface ActivityLog {
    id: string;
    userId: string;
    title: string;
    description: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}