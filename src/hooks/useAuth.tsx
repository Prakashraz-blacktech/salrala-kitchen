import { useEffect, useState } from "react";

const useAuth = () => {
  const user = localStorage.getItem("new-sarala") || null;
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    role: string;
    fullName: string;
    phoneNumber: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setCurrentUser(JSON?.parse(user));
    }
    setIsLoading(false);
  }, [user]);

  return { currentUser, isLoading };
};
export default useAuth;
