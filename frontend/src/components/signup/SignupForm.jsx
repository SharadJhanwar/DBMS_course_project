import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from "lucide-react";

export default function SignupForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Simulated API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Replace with your actual API call:
      // await API.post("/auth/register", form);
      
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative">
      {/* Glassmorphic card */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-white/50 pointer-events-none"></div>
        
        {/* Floating orbs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mb-4 shadow-lg shadow-amber-500/50">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join us for a delightful culinary journey</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-in slide-in-from-top">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${focusedField === 'name' ? 'opacity-20' : ''}`}></div>
                <div className="relative flex items-center">
                  <User className={`absolute left-4 w-5 h-5 transition-colors duration-200 ${focusedField === 'name' ? 'text-amber-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all duration-200"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            </div>

            {/* Email field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${focusedField === 'email' ? 'opacity-20' : ''}`}></div>
                <div className="relative flex items-center">
                  <Mail className={`absolute left-4 w-5 h-5 transition-colors duration-200 ${focusedField === 'email' ? 'text-amber-500' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all duration-200"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Password field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${focusedField === 'password' ? 'opacity-20' : ''}`}></div>
                <div className="relative flex items-center">
                  <Lock className={`absolute left-4 w-5 h-5 transition-colors duration-200 ${focusedField === 'password' ? 'text-amber-500' : 'text-gray-400'}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full pl-12 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all duration-200"
                    placeholder="Create a secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-white font-semibold shadow-lg shadow-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/60 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating your account...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="font-semibold text-amber-600 hover:text-amber-700 transition-colors hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Social proof */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500 mb-3">Trusted by food lovers worldwide</p>
            <div className="flex justify-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-xs text-gray-600 self-center">+10k members</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -z-10 top-1/4 -right-10 w-20 h-20 bg-amber-300/30 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute -z-10 bottom-1/4 -left-10 w-20 h-20 bg-orange-300/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
}