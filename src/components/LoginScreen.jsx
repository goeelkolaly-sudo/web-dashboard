import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  // Subtle interactive stars & constellation lines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const mouse = { x: null, y: null, radius: 130 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const stars = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.6 + 0.5,
      alpha: Math.random() * 0.6 + 0.25,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;

        if (s.x < 0 || s.x > canvas.width) s.vx *= -1;
        if (s.y < 0 || s.y > canvas.height) s.vy *= -1;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${s.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          const dist = Math.hypot(s.x - s2.x, s.y - s2.y);
          if (dist < 105) {
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.strokeStyle = `rgba(20, 184, 166, ${(1 - dist / 105) * 0.22})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const mdist = Math.hypot(s.x - mouse.x, s.y - mouse.y);
          if (mdist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(45, 212, 191, ${(1 - mdist / mouse.radius) * 0.45})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = username.trim().toLowerCase();
    const pass = password.trim();

    if (user === 'admin' && (pass === '123456' || pass === '12345678')) {
      setError('');
      if (rememberMe) {
        localStorage.setItem('neom_admin_auth', 'true');
      }
      onLoginSuccess();
    } else {
      setError('Invalid credentials. Use admin with 123456 or 12345678.');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#04141c] text-slate-100 flex items-center justify-center lg:justify-between px-6 lg:px-16 xl:px-24 py-8">
      {/* City Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-55 scale-105"
        style={{ backgroundImage: "url('/neom-bg.jpg')" }}
      />

      {/* Blended Dark Teal Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#04141c]/70 via-[#051b26]/65 to-[#04141c]/95" />

      {/* Interactive Stars Canvas */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0" />

      {/* Left / Center-Left Modern Editorial Brand Title */}
      <div className="hidden lg:flex flex-col justify-center relative z-10 max-w-xl select-none">
        <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-cyan-300/85 mb-3">
          Smart City Infrastructure
        </span>

        <h2 className="text-5xl xl:text-6xl font-light tracking-[0.26em] text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300/80 leading-tight">
          NEOM <span className="font-semibold">CITY</span>
        </h2>

        <div className="w-28 h-[1px] bg-gradient-to-r from-cyan-400/80 to-transparent my-4" />

        <p className="text-sm text-slate-200/75 font-light tracking-wide max-w-md leading-relaxed">
          Unified IoT telemetry, intelligent traffic flow, and real-time urban monitoring.
        </p>
      </div>

      {/* Right-Aligned Glassmorphism Login Panel */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-cyan-400/20 bg-[#061d28]/85 backdrop-blur-xl px-8 py-10 shadow-2xl shadow-cyan-950/70">
        {/* Shield Badge */}
        <div className="mx-auto mb-3 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/25 to-teal-500/10 border border-cyan-300/40 flex items-center justify-center text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.22)]">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <p className="lg:hidden text-center text-xs tracking-[0.28em] text-cyan-300/90 uppercase">
          NEOM CITY
        </p>

        <h1 className="text-center text-2xl font-bold text-white mt-1 mb-7">
          Admin Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email or User ID */}
          <div className="relative">
            <User className="w-4 h-4 text-cyan-200/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Email or User ID"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0e3446]/85 border border-cyan-400/20 text-sm text-white placeholder-cyan-100/60 focus:outline-none focus:border-cyan-300 transition"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="w-4 h-4 text-cyan-200/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#0e3446]/85 border border-cyan-400/20 text-sm text-white placeholder-cyan-100/60 focus:outline-none focus:border-cyan-300 transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-cyan-200/80 hover:text-white absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Remember me & Hint */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="inline-flex items-center gap-2 text-cyan-100/85 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-cyan-400/40 bg-[#0e3446] text-cyan-400 focus:ring-0"
              />
              <span>Remember me</span>
            </label>
            <span className="text-rose-400/90 font-mono text-[11px]">
              admin / 123456
            </span>
          </div>

          {error && (
            <div className="text-xs text-rose-200 bg-rose-500/15 border border-rose-400/35 rounded-xl px-3.5 py-2.5">
              {error}
            </div>
          )}

          {/* Log In Pill Button */}
          <button
            type="submit"
            className="w-full mt-3 py-3 px-5 rounded-full bg-gradient-to-r from-[#174e63] via-[#1c627a] to-[#174e63] hover:from-cyan-600 hover:to-teal-600 border border-cyan-300/30 text-white font-semibold text-sm shadow-lg shadow-cyan-950/60 transition cursor-pointer"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}