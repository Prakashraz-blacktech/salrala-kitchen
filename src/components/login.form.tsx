/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  loginSchema,
  type LoginFormData,
} from "@/lib/validations/login.schema";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router";
import { NPFlag } from "@/assets";
import { login } from "@/database/service/login.service";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";

export function LoginForm() {
    const {currentUser,isLoading} = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);

    await login(data?.phoneNumber).then((res:any)=>{
        if(res?.success === true){
            localStorage.setItem("new-sarala", JSON.stringify(res));
            navigate("/add-khana");
            toast.success(res?.message)
        }
        setIsSubmitting(false);
    })
  };

  useEffect(()=>{
    if(!isLoading && currentUser){
        navigate("/add-khana")
    }
  },[isLoading, currentUser])


  return (
    <div className="h-screen overflow-hidden mx-auto max-w-sm flex justify-center items-center px-4">
      <div className="w-full ">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-balance">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">
            Enter your phone number to sign in
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone Number
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                <img src={NPFlag} alt="NP" className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">+977</span>
              </div>
              <Input
                id="phoneNumber"
                type="tel"
                className={cn(
                  "pl-20 transition-colors",
                  errors.phoneNumber &&
                    "border-destructive focus-visible:ring-destructive "
                )}
                {...register("phoneNumber")}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-sm text-destructive mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
           
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            New here?{" "}
            <Link
              to="/register"
              className="text-black hover:underline font-medium"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
