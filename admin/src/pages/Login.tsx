
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { login, clearError } from "../store/slices/authSlice";
import { Shirt, Eye, EyeOff, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Clear errors when form values change
  useEffect(() => {
    const subscription = watch(() => {
      if (error) {
        dispatch(clearError());
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, error, dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await dispatch(login(data));
      if (login.fulfilled.match(result)) {
        toast.success("Welcome to Admin Dashboard!", {
          duration: 3000,
        });
      } else if (login.rejected.match(result)) {
        toast.error(result.payload as string || "Login failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleDemoLogin = () => {
    setValue("username", "admin");
    setValue("password", "admin123");
    // Auto-submit after a short delay to show the values being filled
    setTimeout(() => {
      handleSubmit(onSubmit)();
    }, 200);
  };

  const isLoading = loading || isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lv-cream via-lv-beige to-lv-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-20 h-20 bg-luvvencencia-gradient rounded-full vintage-shadow">
              <Shirt className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="mt-8 text-4xl font-bold text-luvvencencia-gradient lv-luxury tracking-[0.15em]">
            LUV VELENCIA
          </h2>
          <h3 className="mt-2 text-xl font-semibold text-lv-brown lv-heading tracking-[0.1em]">
            ADMIN DASHBOARD
          </h3>
          <p className="mt-3 text-sm text-lv-brown/70 lv-body font-medium">
            Sign in to manage your luxury store
          </p>
        </div>

        {/* Demo Credentials Card */}
        <div className="bg-lv-gold/10 border border-lv-gold/30 rounded-xl p-6 vintage-shadow">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-lv-brown mt-0.5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-lv-brown lv-heading tracking-[0.1em]">
                DEMO CREDENTIALS
              </h3>
              <div className="mt-3 text-xs text-lv-brown/80">
                <p className="lv-body font-medium">
                  <span className="font-semibold">Username:</span>{" "}
                  <code className="bg-lv-cream px-2 py-1 rounded border border-lv-brown/20 lv-title">admin</code>
                </p>
                <p className="mt-2 lv-body font-medium">
                  <span className="font-semibold">Password:</span>{" "}
                  <code className="bg-lv-cream px-2 py-1 rounded border border-lv-brown/20 lv-title">admin123</code>
                </p>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="mt-4 admin-btn-gold bg-lv-gold hover:bg-lv-gold/80 text-lv-brown px-4 py-2 rounded-lg lv-body font-semibold text-xs tracking-wide luxury-transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Loading..." : "AUTO FILL & LOGIN"}
              </button>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl vintage-shadow border border-lv-brown/10 p-10">
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-lv-brown mb-2 lv-heading tracking-[0.1em]"
                >
                  USERNAME
                </label>
                <input
                  {...register("username")}
                  type="text"
                  className="admin-input border-lv-brown/20 focus:border-lv-gold focus:ring-lv-gold/20 bg-white/90 backdrop-blur-sm lv-body font-medium placeholder-lv-brown/50"
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="mt-2 text-sm text-red-600 lv-body font-medium">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-lv-brown mb-2 lv-heading tracking-[0.1em]"
                >
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className="admin-input border-lv-brown/20 focus:border-lv-gold focus:ring-lv-gold/20 bg-white/90 backdrop-blur-sm lv-body font-medium placeholder-lv-brown/50 pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-lv-brown/50 hover:text-lv-brown luxury-transition" />
                    ) : (
                      <Eye className="h-5 w-5 text-lv-brown/50 hover:text-lv-brown luxury-transition" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 lv-body font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50/80 border border-red-200 rounded-lg p-4 vintage-shadow">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700 lv-body font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-4 px-6 border border-transparent rounded-lg bg-luvvencencia-gradient hover:bg-royal-gradient text-white lv-body font-semibold text-sm tracking-[0.1em] luxury-transition disabled:opacity-50 disabled:cursor-not-allowed vintage-shadow"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  SIGNING IN...
                </div>
              ) : (
                "SIGN IN TO DASHBOARD"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-lv-brown/60 lv-body font-medium tracking-[0.05em]">
            Secure admin access to your luxury store management system
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
