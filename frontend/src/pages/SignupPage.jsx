import React, { useState, useRef, useEffect, useCallback } from "react";
import { API } from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Refs for pointer tracking and animation
  const panelRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 }); // desired normalized -1..1
  const currentRef = useRef({ x: 0, y: 0 }); // animated current
  const rafRef = useRef(null);

  // blink state
  const [blink, setBlink] = useState(false);
  const manualCloseRef = useRef(false); // if password focused
  const isUnmountedRef = useRef(false);

  // settings (tweak for feel)
  const MAX_X = 7; // px horizontally
  const MAX_Y = 5; // px vertically
  const EASE = 0.14; // lerp factor (0..1)
  const BLINK_DURATION = 140; // ms for quick blink
  const AUTO_BLINK_MIN = 4000;
  const AUTO_BLINK_MAX = 8000;

  // ---- Form handlers ----
  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      navigate("/login");
      // optional: reload to apply auth state
      // window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---- Pointer handling (mouse & touch) ----
  const clamp = (v, a = -1, b = 1) => Math.max(a, Math.min(b, v));

  const handlePointerMove = useCallback((e) => {
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;

    // normalized relative to center (-1..1)
    const nx = clamp((clientX - cx) / (rect.width / 2));
    const ny = clamp((clientY - cy) / (rect.height / 2));

    targetRef.current.x = nx;
    targetRef.current.y = ny;
  }, []);

  const handlePointerLeave = useCallback(() => {
    targetRef.current.x = 0;
    targetRef.current.y = 0;
  }, []);

  // ---- Animation loop: lerp current -> target ----
  useEffect(() => {
    const step = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * EASE;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * EASE;
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ---- Convert normalized currentRef to pixel offsets ----
  const pupilOffsetX = () => currentRef.current.x * MAX_X;
  const pupilOffsetY = () => currentRef.current.y * MAX_Y;

  // head tilt degrees (subtle)
  const headTiltDeg = () => currentRef.current.x * 5; // ±5 degrees

  // ---- Auto-blink timer ----
  useEffect(() => {
    let timerId = null;
    let cancelled = false;

    const schedule = () => {
      const t = AUTO_BLINK_MIN + Math.random() * (AUTO_BLINK_MAX - AUTO_BLINK_MIN);
      timerId = setTimeout(() => {
        if (cancelled) return;
        if (!manualCloseRef.current) {
          setBlink(true);
          setTimeout(() => {
            setBlink(false);
          }, BLINK_DURATION);
        }
        schedule();
      }, t);
    };

    schedule();
    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  // ---- Click to blink anywhere on window ----
  useEffect(() => {
    const handleClick = () => {
      if (manualCloseRef.current) return;
      setBlink(true);
      setTimeout(() => setBlink(false), BLINK_DURATION);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // ---- Close on password focus ----
  const onPwdFocus = () => {
    manualCloseRef.current = true;
    setBlink(true);
  };
  const onPwdBlur = () => {
    manualCloseRef.current = false;
    setBlink(false);
  };

  // cleanup unmount
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ---- Accessibility: keypress enter on panel triggers blink (optional) ----
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const handleKey = (e) => {
      if (e.key === "Enter") {
        if (!manualCloseRef.current) {
          setBlink(true);
          setTimeout(() => setBlink(false), BLINK_DURATION);
        }
      }
    };
    panel.addEventListener("keydown", handleKey);
    return () => panel.removeEventListener("keydown", handleKey);
  }, []);

  // ---- Helper to compute pupil transform with constraint inside eyeball ellipse ----
  // Our simplistic approach: limit by MAX_X/MAX_Y (works well visually).
  // For perfect geometric constraint you'd calculate based on ellipse equation.
  const leftPupilTransform = `translate(${pupilOffsetX()} ${pupilOffsetY()})`;
  const rightPupilTransform = `translate(${pupilOffsetX()} ${pupilOffsetY()})`;

  // ---- Render ----
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* LEFT PANEL - interactive chef (visible on md+) */}
      <div
        ref={panelRef}
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        onTouchMove={(e) => {
          // handle first touch
          if (e.touches && e.touches[0]) handlePointerMove(e.touches[0]);
        }}
        onTouchEnd={handlePointerLeave}
        className="hidden md:flex w-1/2 items-center justify-center p-12 bg-linear-to-br from-amber-500 to-orange-400 text-white"
        aria-hidden="false"
        tabIndex={0} // make it keyboard focusable for accessibility interactions
      >
        <div className="max-w-md text-center space-y-6">
          <div className="mx-auto w-72 h-72 bg-white/10 rounded-2xl p-4 flex items-center justify-center shadow-lg relative">
            {/* Chef SVG */}
            <svg
              viewBox="0 0 300 300"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Chef mascot"
            >
              <title>Zaika chef mascot</title>

              {/* defs for gradients */}
              <defs>
                <linearGradient id="hatGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#f3f3f3" />
                </linearGradient>

                <radialGradient id="faceShade" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#fff9f2" />
                  <stop offset="100%" stopColor="#ffeedd" />
                </radialGradient>

                <radialGradient id="pupilGrad" cx="35%" cy="35%" r="80%">
                  <stop offset="0%" stopColor="#393939" />
                  <stop offset="100%" stopColor="#111111" />
                </radialGradient>

                <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.12" />
                </filter>
              </defs>

              {/* hat group */}
              <g transform="translate(150,40)">
                <path
                  d="M-80,20 C-80,-30 80,-30 80,20 L80,40 C80,70 -80,70 -80,40 Z"
                  fill="url(#hatGradient)"
                  stroke="#e9e9e9"
                  strokeWidth="1"
                />
                {/* hat rim */}
                <ellipse cx="0" cy="40" rx="82" ry="12" fill="#fff" opacity="0.9" stroke="#efecec" />
              </g>

              {/* head group (translate center then apply rotation for head tilt) */}
              <g
                transform={`translate(150,135) rotate(${headTiltDeg()})`}
                style={{ transition: "transform 0.08s linear" }}
              >
                {/* face base */}
                <ellipse cx="0" cy="0" rx="85" ry="80" fill="url(#faceShade)" filter="url(#softShadow)" />
                {/* chin shading */}
                <ellipse cx="0" cy="50" rx="80" ry="22" fill="#feeede" opacity="0.9" />
              </g>

              {/* cheeks */}
              <circle cx="110" cy="160" r="10" fill="#ffd6c0" opacity="0.95" />
              <circle cx="190" cy="160" r="10" fill="#ffd6c0" opacity="0.95" />

              {/* moustache */}
              <path d="M110 175 q30 18 70 0" stroke="#6b4a2a" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M190 175 q-30 18 -70 0" stroke="#6b4a2a" strokeWidth="5" fill="none" strokeLinecap="round" />

              {/* mouth (soft smile) */}
              <path d="M145 188 q8 11 18 0" stroke="#b3532d" strokeWidth="3" fill="none" strokeLinecap="round" />

              {/* subtle eye shadows for 3D depth */}
              <ellipse cx="115" cy="143" rx="20" ry="15" fill="rgba(0,0,0,0.05)" />
              <ellipse cx="185" cy="143" rx="20" ry="15" fill="rgba(0,0,0,0.05)" />

              {/* left eyeball white */}
              <g id="leftEye" aria-hidden>
                <ellipse cx="115" cy="140" rx="18" ry="14" fill="#fff" stroke="#efe7de" />
              </g>

              {/* right eyeball white */}
              <g id="rightEye" aria-hidden>
                <ellipse cx="185" cy="140" rx="18" ry="14" fill="#fff" stroke="#efe7de" />
              </g>

              {/* pupils group (we translate these groups via CSS/transform from React) */}
              {/* left pupil group */}
              <g id="leftPupilGroup" transform={leftPupilTransform}>
                {!blink ? (
                  // open pupil as circle
                  <g id="leftPupil">
                    <circle cx="115" cy="140" r="6.5" fill="url(#pupilGrad)" />
                    {/* small specular highlight */}
                    <circle cx="112" cy="137" r="1.2" fill="rgba(255,255,255,0.85)" />
                  </g>
                ) : (
                  // closed eyelid: simple line with slight curve
                  <g id="leftLid">
                    <path d="M103 140 Q115 132 127 140" stroke="#f0dbd1" strokeWidth="9" strokeLinecap="round" />
                    <path d="M103 140 Q115 136 127 140" stroke="#bfa79a" strokeWidth="1" fill="none" strokeLinecap="round" />
                  </g>
                )}
              </g>

              {/* right pupil group */}
              <g id="rightPupilGroup" transform={rightPupilTransform}>
                {!blink ? (
                  <g id="rightPupil">
                    <circle cx="185" cy="140" r="6.5" fill="url(#pupilGrad)" />
                    <circle cx="182" cy="137" r="1.2" fill="rgba(255,255,255,0.85)" />
                  </g>
                ) : (
                  <g id="rightLid">
                    <path d="M173 140 Q185 132 197 140" stroke="#f0dbd1" strokeWidth="9" strokeLinecap="round" />
                    <path d="M173 140 Q185 136 197 140" stroke="#bfa79a" strokeWidth="1" fill="none" strokeLinecap="round" />
                  </g>
                )}
              </g>

              {/* eyebrows */}
              <path d="M104 126 q12 -9 22 0" stroke="#6b4a2a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.75" />
              <path d="M174 126 q12 -9 22 0" stroke="#6b4a2a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.75" />

              {/* scarf or collar */}
              <path d="M90 200 q60 28 120 0" fill="#ffefea" stroke="#f7d7c0" strokeWidth="1" />
            </svg>

            {/* small decorative floating plate (visual flourish) */}
            <div className="absolute -right-6 -top-6 w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shadow-md">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M2 12a10 10 0 0 0 20 0" />
              </svg>
            </div>
          </div>

          {/* Heading + CTA */}
          <h2 className="text-4xl font-bold drop-shadow-sm">Join ZaikaRestro</h2>
          <p className="text-white/90">Fresh ingredients, fast delivery, and a warm plate every time.</p>

          <div className="pt-4 flex justify-center gap-4">
            <a href="/menu" className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-white hover:bg-white/30 transition">
              Explore Menu
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-white hover:bg-white/10 transition">
              Our Story
            </a>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Create your account</h3>
          <p className="text-sm text-gray-500 mb-6">Sign up to save addresses, order faster and track your deliveries.</p>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="Your full name"
                aria-label="Full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="you@example.com"
                aria-label="Email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                onFocus={onPwdFocus}
                onBlur={onPwdBlur}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="Create a password"
                aria-label="Password"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-700 transition disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm({ name: "", email: "", password: "" });
                  setError("");
                }}
                className="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </form>

          <p className="mt-6 text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-amber-600 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
