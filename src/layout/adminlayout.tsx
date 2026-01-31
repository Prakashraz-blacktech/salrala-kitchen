import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { getUserById } from "@/database/service/me.service";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const {currentUser} = useAuth();
    const navigate = useNavigate();
    const getAdmin = async () => {
        if(!currentUser?.id){
            return;
        }
        setLoading(true);
        const user = await getUserById(currentUser?.id || "");
        setLoading(false);
        setRole(user?.role);
    }
    useEffect(() => {
        getAdmin();
    }, [currentUser?.id]);

    if(loading){
        return <div className="flex h-screen overflow-hidden justify-center items-center">
            <Loader2 className="animate-spin"/>
        </div>;
    }

    if(!role || role !== "ADMIN"){
        return <div className="flex h-screen overflow-hidden justify-center items-center">
            <p className="text-2xl font-bold text-red-500">You are not authorized to access this page</p>
            <button onClick={() => navigate("/")} className="bg-red-500 text-white px-4 py-2 rounded-md mt-4">Go Back</button>
        </div>;
    }
    return <>{children}</>;
};
export default AdminLayout;