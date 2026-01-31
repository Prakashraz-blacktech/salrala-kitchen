/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useCallback } from "react";
import { allUsers } from "@/database/service/user.service"; // your pagination function
import { Loader2 } from "lucide-react";

const AdminUsers = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lastDoc, setLastDoc] = useState<any>(null);

  const pageSize = 10;

  // Fetch users
  const loadUsers = async () => {
    if (loading) return;
    if (lastDoc && !hasMore) return;

    setLoading(true);
    try {
      const { users: newUsers, lastDoc: newLastDoc, hasMore: more } =
        await allUsers({ pageSize, lastDoc });
      setUsers((prev:any[]) => [...new Set([...prev, ...newUsers])]);
      setLastDoc(newLastDoc);
      setHasMore(more);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Intersection Observer for infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);
  const lastUserRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();
      if (!node) return;

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadUsers();
        }
      });

      observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h1 className="text-center text-2xl font-semibold mb-4">User Meal Details</h1>

      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b text-xs">Particulars</th>
            <th className="px-4 py-2 border-b text-xs">Total Meal</th>
            <th className="px-4 py-2 border-b text-xs">Total Amount</th>
            <th className="px-4 py-2 border-b text-xs">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const isLast = index === users.length - 1;
            return (
              <tr
                key={user.id}
                ref={isLast ? lastUserRef : null}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2 border-b text-xs">
                  <p className="text-xs">{user.devnagariName || ""}</p>
                  
                </td>
                <td className="px-4 py-2 border-b text-center text-xs">
                  {user.totalMeal || 0}
                </td>
                <td className="px-4 py-2 border-b text-center text-xs">
                  Rs.{user?.outstandingAmount || 0}
                </td>
                <td className="px-4 py-2 border-b text-center">
                 
                 
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {loading && (
        <div className="flex justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      {!hasMore && users.length > 0 && (
        <p className="text-center text-gray-500 mt-2">No more users</p>
      )}
    </div>
  );
};

export default AdminUsers;
