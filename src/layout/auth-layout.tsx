import { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(!isLoading && !currentUser){
      navigate("/", { replace: true });
    }
  }, [currentUser, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex h-screen overflow-hidden justify-center items-center">
        <Loader2 className="animate-spin"/>
    </div>;
  }

  return <>{children}</>;
};
