import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/validations/register.schema";
import { cn } from "@/lib/utils";
import { createStudent } from "@/database/service/create-user.service";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";

export function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoading, currentUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);

    await createStudent({
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
    }).then(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (res: any) => {
        if (res?.success === true) {
        
          navigate("/");
          toast.success(res?.message);
        }
      }
    );

    setIsSubmitting(false);
    reset();
  };

  useEffect(() => {
    if (!isLoading && currentUser) {
      navigate("/add-khana");
    }
  }, [isLoading, currentUser]);
  
  return (
    <div className="flex justify-center items-center h-screen max-w-sm mx-auto">
      <div className="w-full px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-balance mb-2">
            Join Sarala Kitchen!
          </h1>
          <p className="text-muted-foreground">
            Enter your details an have a delicious meal.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              className={cn(
                "transition-colors",
                errors.fullName &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              className={cn(
                "transition-colors",
                errors.phoneNumber &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-destructive mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-black hover:underline font-medium">
            Sign In
          </Link>
        </p>
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            By registering, you agree to our{" "}
            <a href="#" className="text-black hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-black hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
