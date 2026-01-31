/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchPayments } from "@/database/service/payement.service";
import { useEffect, useState } from "react";

const PaymentHistory = ({ userId }: { userId: string }) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);

  const loadActivityLogs = async () => {
    if (loading) return;

    if (lastDoc && !hasMore) return;

    setLoading(true);

    try {
      const {
        payments: newPayments,
        lastDoc: newLastDoc,
        hasMore: more,
      } = await fetchPayments({ userId, pageSize: 10, lastDoc });

      console.log("Fetched payments:", newPayments);
      setPayments((prev: any[]) => {
        const combined = [...prev, ...(newPayments as any)];
        const uniqueMap = new Map();
        combined.forEach((item) => uniqueMap.set(item.id, item));
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

  console.log(payments)
  return (
    <div className="mt-4 sm:mt-6">
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 sm:p-6 pb-3 sm:pb-6">
          <h2 className="flex items-center gap-2 text-foreground text-lg sm:text-xl font-semibold">
            Payment Records
          </h2>
        </div>
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
          <div className="space-y-3 sm:space-y-4">
            {payments?.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-muted/50 rounded-lg border border-border hover:bg-muted/70 transition-colors gap-2 sm:gap-0"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">
                    {payment.amount}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-xs sm:text-sm text-muted-foreground">
                    <span>{payment.date}</span>
                    <span>{payment.method}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
