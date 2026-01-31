/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchActivityLogs } from "@/database/service/activity.service";
import type { ActivityLog } from "@/types/activity-log.type";
import { Activity, Clock, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ActivityLogsProps {
  userId: string;
}

const ActivityLogs = ({ userId }: ActivityLogsProps) => {
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lastDoc, setLastDoc] = useState<any>(null);

 const loadActivityLogs = async () => {
  if (loading) return;

  if (lastDoc && !hasMore) return;

  setLoading(true);

  try {
    const {
      activityLog: newActivityLog,
      lastDoc: newLastDoc,
      hasMore: more,
    } = await fetchActivityLogs({ userId, pageSize, lastDoc });

    setActivityLog((prev: any[]) => {
      const combined = [...prev, ...newActivityLog];
      const uniqueMap = new Map();
      combined.forEach(item => uniqueMap.set(item.id, item));
      return Array.from(uniqueMap.values());
    });
    setLastDoc(newLastDoc);
    setHasMore(more);
  } catch (err) {
    console.error("Failed to load activity logs:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadActivityLogs();
  }, []);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastActivityLogRef = useCallback(
    (node: never) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadActivityLogs();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="mt-4 sm:mt-6">
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 sm:p-6 pb-3 sm:pb-6">
          <h2 className="flex items-center gap-2 text-foreground text-lg sm:text-xl font-semibold">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
            Recent Activity
          </h2>
        </div>
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
          <div className="space-y-3 sm:space-y-4">
            {activityLog.map((activity, index) => {
              const isLast = activityLog.length === index + 1;
              return (
              <div
                key={index}
                ref={isLast ? lastActivityLogRef : null}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-muted/50 rounded-lg border border-border hover:bg-muted/70 transition-colors gap-2 sm:gap-0"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">
                    {activity.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-xs sm:text-sm text-muted-foreground">
                    <span>
                      {activity?.createdAt?.toDate().toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span> {new Date(
                          activity?.createdAt?.seconds * 1000
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true, // AM/PM format
                        })}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
            {loading && (
              <div className="flex items-center justify-center p-3 sm:p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
