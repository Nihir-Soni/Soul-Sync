import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router';



export default function LoginBox() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const res=await loginUser(formData);
      console.log("Signed in:",res.data);
      localStorage.setItem("authToken", res.data.token);
      navigate("/diary");
    } catch (err) {
      console.log(err);
      alert("Error signing in");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          0% {
            transform: translateX(600px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.8s ease-out forwards;
        }
      `}</style>
    <div className="absolute w-[400px] h-[580px] right-[140px] top-[50px] flex items-center justify-center p-4 animate-slide-in">
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-700 to-amber-900 p-3 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-amber-100">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="p-3">
            {/* Email Input */}
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-amber-700" />
                </div>
                <input
                  type="email"
                  autoComplete='off'
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:border-transparent transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-amber-700" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-amber-700 transition" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-amber-700 transition" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="mb-4 text-right">
              <a href="#" className="text-sm text-amber-700 font-semibold hover:text-amber-900 transition">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-700 to-amber-900 text-white py-3 rounded-lg font-semibold hover:from-amber-800 hover:to-amber-950 transform hover:scale-105 transition duration-200 shadow-lg"
            >
              Sign In
            </button>
                  </form>
            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-amber-700 font-semibold hover:text-amber-900 transition">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}