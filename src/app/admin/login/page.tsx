'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);

    setTimeout(() => {
      const validPasswords = ['admin123', '1234', 'admin'];
      const validUsernames = ['admin', 'tellyfilmy', 'editor', ''];

      const isUserValid = validUsernames.includes(username.trim().toLowerCase()) || username.trim().length > 0;
      const isPassValid = validPasswords.includes(password.trim());

      if (isUserValid && isPassValid) {
        localStorage.setItem('tf_admin_auth', 'true');
        sessionStorage.setItem('tf_admin_auth', 'true');
        toast({ title: '✅ Access Granted', description: 'Welcome to TellyFilmy Admin Panel' });
        // Force clean window redirect to reload layout auth state smoothly
        window.location.href = '/admin';
      } else {
        setIsError(true);
        setErrorMessage('Invalid Admin ID or Password. Default: admin / admin123');
        toast({
          title: 'Authentication Failed',
          description: 'Please check your Admin ID and password.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0B1120] overflow-hidden px-4">
      {/* Background glow effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-rose-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div
        className={`relative z-10 w-full max-w-[420px] transition-all duration-300 ${isError ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}
      >
        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/90 backdrop-blur-xl shadow-2xl overflow-hidden">
          
          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-[#e11d48] to-rose-600" />

          <div className="p-7 sm:p-9">
            {/* Brand Logo */}
            <div className="text-center mb-8 flex flex-col items-center">
              <Image
                src="/logo.png"
                alt="Telly Filmy"
                width={180}
                height={50}
                priority
                className="h-10 w-auto object-contain mb-3"
              />
              <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-[#e11d48]" />
                <span>Admin CMS Portal</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Admin ID / Username */}
              <div className="space-y-1.5">
                <label htmlFor="username" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Admin ID / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setIsError(false); }}
                    placeholder="admin"
                    required
                    autoComplete="username"
                    className="w-full h-11 pl-10 pr-4 bg-slate-800/90 border border-slate-700 focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48]/40 rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className={`h-4 w-4 ${isError ? 'text-rose-400' : 'text-slate-500'}`} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setIsError(false); }}
                    placeholder="Enter password (e.g. 1234 or admin123)"
                    required
                    autoComplete="current-password"
                    className={`w-full h-11 pl-10 pr-10 bg-slate-800/90 border rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none transition-all ${
                      isError
                        ? 'border-rose-500/60 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                        : 'border-slate-700 focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48]/40'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {isError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1.5 pt-1">
                    <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                    {errorMessage}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || !password}
                className="w-full h-12 mt-2 bg-gradient-to-r from-orange-500 via-[#e11d48] to-rose-600 hover:opacity-95 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center space-y-1">
              <p className="text-[11px] text-slate-500 font-medium">
                Default Credentials: <span className="text-slate-400 font-mono">admin</span> / <span className="text-slate-400 font-mono">1234</span>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4 font-mono">
          🔒 Private Admin Endpoint
        </p>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-6px); }
          30%, 60%, 90% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
