import { fetchUserKhana } from "@/database/service/getAllKhana.service";
import type { Timestamp } from "firebase/firestore";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";

interface UserKhanaProps {
  userId: string;
}

const UserKhana = ({ userId }: UserKhanaProps) => {
  const [khanas, setKhanas] = useState<
    {
      id: string;
      userId: string;
      quantity: number;
      shift: string;
      date: string;
      time: string;
      createdAt: Timestamp;
      updatedAt: Timestamp;
      addOns: { name: string; quantity: number; price: number }[];
      addedBy: string;
      totalPrice: number;
    }[]
  >([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const pageSize = 10;

  const observer = useRef<IntersectionObserver | null>(null);
  const lastKhanaRef = useCallback(
    (node: never) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadKhanas();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const loadKhanas = useCallback(async () => {
    if (!hasMore || loading || !userId) return;

    setLoading(true);
    try {
      const {
        khanas: newKhanas,
        lastDoc: newLastDoc,
        hasMore: more,
      } = await fetchUserKhana({ userId, pageSize, lastDoc });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setKhanas((prev: any) => {
        const combined = [...prev, ...newKhanas];
        const unique = Array.from(
          new Map(combined.map((item) => [item.id, item])).values()
        );
        return unique;
      });

      setLastDoc(newLastDoc);
      setHasMore(more);
    } catch (err) {
      console.error("Failed to load khanas:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, lastDoc, hasMore, loading]);

  useEffect(() => {
    setKhanas([]);
    setLastDoc(null);
    setHasMore(true);
    loadKhanas();
  }, [userId]);

  

  return (
    <div className="mt-4 sm:mt-6">
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 sm:p-6 pb-3 sm:pb-6">
          <h2 className="flex items-center gap-2 text-foreground text-lg sm:text-xl font-semibold">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            Recent Meals
          </h2>
        </div>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
          <div className="space-y-3 sm:space-y-4">
            {khanas?.map((meal, index) => {
              const isLast = khanas.length === index + 1;

              return (
                <div
                  key={meal.id}
                  ref={isLast ? lastKhanaRef : null}
                  className="flex overflow-hidden  relative flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-muted/50 rounded-lg border border-border hover:bg-muted/70 transition-colors gap-2 sm:gap-0"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-800 text-sm sm:text-base">
                      #Khana x{meal.quantity}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-xs sm:text-sm text-muted-foreground">
                      <span>
                        {meal?.date} | {meal?.shift}
                      </span>

                      <div className="flex items-center gap-1">
                        Rs.<span>{meal.totalPrice}</span>
                      </div>
                      {meal?.addOns?.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <p className="font-semibold text-foreground text-sm sm:text-base">
                            Addition
                          </p>
                          {meal?.addOns?.map(
                            (
                              addon: {
                                name: string;
                                quantity: number;
                                price: number;
                              },
                              indx: number
                            ) => (
                              <div
                                key={addon?.name}
                                className="flex items-center gap-1"
                              >
                                <span>
                                  {indx + 1}.{addon?.name}
                                </span>
                                <span>x{addon?.quantity}</span>
                                <span>Rs.{addon?.price}</span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute flex items-center gap-2 top-0 right-0 w-auto px-2 h-6 bg-green-500 rounded-bl-lg">
                    <div className="flex items-center gap-2 text-xs text-white">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(
                          meal.createdAt.seconds * 1000
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true, // AM/PM format
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {loading && (
            <div className="mt-2 flex justify-center items-center">
              <Loader2 className="animate-spin" />
            </div>
          )}
          {!hasMore && khanas.length > 0 && (
            <p className="mt-2 text-sm text-center">No more meals.</p>
          )}
          {khanas.length === 0 && !loading && (
            <p className="mt-2 text-sm text-center">No meals found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserKhana;
