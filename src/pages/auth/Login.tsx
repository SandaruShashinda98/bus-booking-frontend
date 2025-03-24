import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox";
import { LockKeyhole, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // const { login } = useAuth(); // Use the login function from auth context hook
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
       const user = await authService.login(data.email, data.password);
       console.log(user)

      
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to login. Please check your credentials and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center w-full p-4 justify-center min-h-screen bg-gray-100">
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
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </a>
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

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                className="bg-white"
                checked={rememberMe}
                disabled={isLoading}
                onCheckedChange={(checked) => setValue("rememberMe", checked)}
                {...register("rememberMe")}
              />
              <Label htmlFor="rememberMe" className="text-sm font-normal">
                Remember me for 30 days
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            {/* <div className="text-center text-sm">
              Don't have an account?{" "}
              <a
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                Sign up
              </a>
            </div> */}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;