import React, { useState, type JSX } from "react";
import InputField from "../../../components/InputField";
import { Button } from "../../../components/Button";
import { useAuthActions } from "../../../hooks/useAuthActions";
import {
  CheckCircle,
  Cpu,
  Eye,
  EyeOff,
  FileCheck,
  Lock,
  Mail,
  Shield,
} from "lucide-react";
import certifai_logo_no_text from "../../../assets/certifai-logo-no-text.svg";

type LoginForm = {
  email: string;
  password: string;
};

export default function Login(): JSX.Element {
  const { handleLogin, handleGoogleLogin, isLoading, errors, message } =
    useAuthActions();

  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(formData.email, formData.password);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Brand & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#000002] via-[#000002] to-[#1a1a1a] relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 left-20 h-32 w-32 bg-[#d0f600] rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-20 right-20 h-40 w-40 bg-[#aa6bfe] rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 h-24 w-24 bg-[#d0f600] rounded-full opacity-10 blur-lg"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle, #aa6bfe 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="text-left relative z-10 flex flex-col justify-center px-16 pt-10 pb-20">
          {/* Logo/Brand Area */}
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <div className="flex items-center gap-2">
                <img
                  src={certifai_logo_no_text}
                  alt="Logo Icon"
                  className="h-12"
                />
              </div>
              <span className="text-2xl font-bold text-white">CertifAI</span>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Welcome back to the future of
              <span className="text-[#d0f600]"> document security</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Experience the power of AI-driven document management with
              blockchain-level security and trust.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center p-4 bg-white bg-opacity-5 rounded-xl backdrop-blur-sm border border-white border-opacity-10">
              <div className="bg-[#aa6bfe] p-3 rounded-lg mr-4 flex-shrink-0">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Blockchain Security
                </h3>
                <p className="text-sm text-gray-300">
                  Immutable document protection with cryptographic verification
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-white bg-opacity-5 rounded-xl backdrop-blur-sm border border-white border-opacity-10">
              <div className="bg-[#d0f600] p-3 rounded-lg mr-4 flex-shrink-0">
                <Cpu className="h-6 w-6 text-[#000002]" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  AI-Powered Intelligence
                </h3>
                <p className="text-sm text-gray-300">
                  Smart document analysis and automated compliance checking
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-white bg-opacity-5 rounded-xl backdrop-blur-sm border border-white border-opacity-10">
              <div className="bg-[#aa6bfe] p-3 rounded-lg mr-4 flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Instant Verification
                </h3>
                <p className="text-sm text-gray-300">
                  Real-time authenticity checks with comprehensive audit trails
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 lg:px-16 py-12 bg-gray-50"
      >
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center mb-4">
              <div className="h-10 w-10 bg-[#aa6bfe] rounded-lg flex items-center justify-center mr-2">
                <FileCheck className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#000002]">CertifAI</span>
            </div>
            <h1 className="text-2xl font-bold text-[#000002] mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600">
              Sign in to your secure document platform
            </p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Form Header */}
            <div className=" px-8 pt-5">
              <h3 className="text-2xl font-semibold text-gray-900">Sign In</h3>
              <p className="text-md text-gray-600 mt-1">
                Enter your credentials below
              </p>
            </div>

            {/* Form Content */}
            <div className="pt-4 p-8">
              <div className="space-y-6 text-left ">
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  leftIcon={Mail}
                  required
                />

                <InputField
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  leftIcon={Lock}
                  rightIcon={showPassword ? EyeOff : Eye}
                  onRightIconClick={() => setShowPassword(!showPassword)}
                  required
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-[#aa6bfe] focus:ring-[#aa6bfe]"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-sm text-[#aa6bfe] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                {errors && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                    <p className="text-sm text-red-700">{errors}</p>
                  </div>
                )}

                {message && (
                  <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                    <p className="text-sm text-green-700">{message}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                  showArrow={!isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Sign In */}
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </Button>

                {/* Sign up link */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <a
                      href="/register"
                      className="text-[#aa6bfe] hover:underline font-medium"
                    >
                      Create one.
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
