/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import {
  Phone,
  User,
  AlertCircle,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import UserKhana from "./user'skhana";
import ActivityLogs from "./activity-logs";
import { getMe } from "@/database/service/user.service";
import { useNavigate } from "react-router";
import PaymentHistory from "./payment-history";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("meals");
  const { currentUser } = useAuth();
  const [user, setUser] = useState<{
    id: string;
    fullName: string;
    phoneNumber: string;
    role: string;
    outstandingAmount: number;
  } | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("new-sarala");
    navigate("/");
  };

  const getUser = async () => {
    if (!currentUser?.id) {
      return;
    }
    const user = await getMe(currentUser?.id || "");
    setUser(user as any);
  };

  useEffect(() => {
    getUser();
  }, [currentUser?.id]);


 

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 max-w-md mx-auto">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6 md:p-8">
              <div className="flex justify-between mb-3 sm:mb-4">
                <button
                  onClick={() => navigate("/")}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 sm:gap-2 border border-white/20"
                >
                  <ArrowLeft className="w-5" />
                  Back
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 sm:gap-2 border border-white/20"
                >
                  <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Logout
                </button>
              </div>

              {/* User Info Section */}
              <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
                <div className="bg-white/20 backdrop-blur-sm p-2.5 sm:p-3 rounded-full shrink-0">
                  <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold text-white break-words">
                    {user?.fullName}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-100 shrink-0" />
                    <span className="text-blue-100 text-xs sm:text-sm md:text-base">
                      {user?.phoneNumber}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 md:p-8">
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg sm:rounded-xl p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <div className="bg-red-100 dark:bg-red-900/40 p-2 rounded-lg shrink-0">
                    <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                      Outstanding Balance
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">
                      Rs.{user?.outstandingAmount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="grid w-full grid-cols-3 bg-muted h-auto rounded-lg p-2">
            <button
              onClick={() => setActiveTab("meals")}
              className={`text-xs sm:text-sm py-2 sm:py-3 rounded-md transition-all duration-200 font-medium ${
                activeTab === "meals"
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Meal History
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`text-xs sm:text-sm py-2 sm:py-3 px-1 rounded-md transition-all duration-200 font-medium ${
                activeTab === "payments"
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Payment History
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`text-xs sm:text-sm py-2 sm:py-3 rounded-md transition-all duration-200 font-medium ${
                activeTab === "activity"
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Activity Log
            </button>
          </div>

          {activeTab === "meals" && currentUser?.id && (
            <UserKhana userId={currentUser?.id || ""} />
          )}

          {activeTab === "payments" && <PaymentHistory userId={currentUser?.id || ""} />}

          {activeTab === "activity" && currentUser?.id && (
            <ActivityLogs userId={currentUser?.id || ""} />
          )}
        </div>
      </div>
    </div>
  );
}
