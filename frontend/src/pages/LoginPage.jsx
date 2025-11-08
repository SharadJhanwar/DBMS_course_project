import React, { useState, useRef, useEffect, useCallback } from "react";
import { API } from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Eye tracking refs
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const panelRef = useRef(null);
  const [blink, setBlink] = useState(false);
  const rafRef = useRef(null);
  const manualCloseRef = useRef(false);

  const MAX_X = 7;
  const MAX_Y = 4;
  const EASE = 0.14;

  useEffect(() => {
    let timer = null;
    const schedule = () => {
      const t = 4000 + Math.random() * 4000;
      timer = setTimeout(() => {
        if (!manualCloseRef.current) {
          setBlink(true);
          setTimeout(() => setBlink(false), 150);
        }
        schedule();
      }, t);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  const handlePointerMove = useCallback((e) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2));
    const ny = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
    targetRef.current.x = Math.max(-1, Math.min(1, nx));
    targetRef.current.y = Math.max(-1, Math.min(1, ny));
  }, []);

  const handlePointerLeave = useCallback(() => {
    targetRef.current.x = 0;
    targetRef.current.y = 0;
  }, []);

  useEffect(() => {
    const animate = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * EASE;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * EASE;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const pxX = () => currentRef.current.x * MAX_X;
  const pxY = () => currentRef.current.y * MAX_Y;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* LEFT PANEL */}
      <div
        ref={panelRef}
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        className="hidden md:flex w-1/2 items-center justify-center bg-linear-to-br from-orange-400 to-amber-500 text-white p-12"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto w-72 h-72 bg-white/10 rounded-2xl p-4 flex items-center justify-center shadow-lg relative">
            <svg viewBox="0 0 300 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(150,40)">
                <path d="M-80,20 C-80,-30 80,-30 80,20 L80,40 C80,70 -80,70 -80,40 Z" fill="#fff" />
              </g>
              <g transform="translate(150,135)">
                <ellipse cx="0" cy="0" rx="85" ry="80" fill="#fff8f1" />
                <ellipse cx="0" cy="50" rx="80" ry="22" fill="#feeede" />
              </g>
              <circle cx="110" cy="160" r="10" fill="#ffd6c0" />
              <circle cx="190" cy="160" r="10" fill="#ffd6c0" />
              <path d="M110 175 q30 18 70 0" stroke="#6b4a2a" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M190 175 q-30 18 -70 0" stroke="#6b4a2a" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M145 188 q8 11 18 0" stroke="#b3532d" strokeWidth="3" fill="none" strokeLinecap="round" />

              <ellipse cx="115" cy="140" rx="18" ry="14" fill="#fff" stroke="#efe7de" />
              <ellipse cx="185" cy="140" rx="18" ry="14" fill="#fff" stroke="#efe7de" />

              <g transform={`translate(${pxX()}, ${pxY()})`}>
                {!blink ? (
                  <>
                    <circle cx="115" cy="140" r="6.5" fill="#262626" />
                    <circle cx="185" cy="140" r="6.5" fill="#262626" />
                  </>
                ) : (
                  <>
                    <line x1="103" y1="140" x2="127" y2="140" stroke="#262626" strokeWidth="3" strokeLinecap="round" />
                    <line x1="173" y1="140" x2="197" y2="140" stroke="#262626" strokeWidth="3" strokeLinecap="round" />
                  </>
                )}
              </g>
              <path d="M104 126 q12 -9 22 0" stroke="#6b4a2a" strokeWidth="2" fill="none" opacity="0.75" />
              <path d="M174 126 q12 -9 22 0" stroke="#6b4a2a" strokeWidth="2" fill="none" opacity="0.75" />
              <path d="M90 200 q60 28 120 0" fill="#ffefea" stroke="#f7d7c0" strokeWidth="1" />
            </svg>
          </div>

          <h2 className="text-4xl font-bold drop-shadow-sm">Welcome back 👋</h2>
          <p className="text-white/90 text-lg">Log in to continue enjoying ZaikaRestro’s best dishes.</p>
        </div>
      </div>

      {/* RIGHT PANEL (FORM) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Login to your account</h3>
          <p className="text-sm text-gray-500 mb-6">Welcome back! Please enter your credentials.</p>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                onFocus={() => {
                  manualCloseRef.current = true;
                  setBlink(true);
                }}
                onBlur={() => {
                  manualCloseRef.current = false;
                  setBlink(false);
                }}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 text-white py-2 rounded-lg font-medium hover:bg-amber-700 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600 text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-amber-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
