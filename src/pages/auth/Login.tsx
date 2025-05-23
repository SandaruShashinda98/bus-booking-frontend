import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LockKeyhole, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/authService";
import useAuthGuard from "@/contexts/AuthGuardContext";
import { PERMISSIONS } from "@/config/permission";

export interface IUser {
  permissions: string[];
  access_token_expires_in: number;
  created_by: string;
  created_on: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  user_role: PERMISSIONS;
}

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setRole } = useAuthGuard();

  useEffect(() => {
    // Check if user just registered successfully
    const queryParams = new URLSearchParams(location.search);
    const registered = queryParams.get("registered");

    if (registered === "true") {
      setSuccessMessage(
        "Registration successful! You can now log in with your new account."
      );
    }
  }, [location]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      const user: IUser = await authService.login(data.email, data.password);
      setUser(user);
      setRole(user?.user_role);

      if (user.user_role === PERMISSIONS.ADMIN) {
        navigate("/user-management");
      } else if (user.user_role === PERMISSIONS.RESTAURANT) {
        navigate("/restaurant-dashboard");
      } else if (user.user_role === PERMISSIONS.BUS_OWNER) {
        navigate("/dashboard");
      } else {
        navigate("/driver-dashboard");
      }

      // Redirect to dashboard after successful login
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to login. Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center w-full p-4 justify-center min-h-screen bg-slate-500">
      <Card className="w-full max-w-md shadow-lg pb-2">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to Bus Buddy
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <Mail size={18} />
                </div>
                <Input
                  id="email"
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Please enter a valid email",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {/* <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </a> */}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <LockKeyhole size={18} />
                </div>
                <Input
                  id="password"
                  type="password"
                  className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                  disabled={isLoading}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="flex items-center justify-center w-full">
              <div className="border-t border-gray-300 w-full"></div>
              <span className="px-4 text-gray-500 text-sm">OR</span>
              <div className="border-t border-gray-300 w-full"></div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/register")}
            >
              Create Account
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
