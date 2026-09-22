'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);

    setTimeout(() => {
      if (password === 'admin123' || password === '1234') {
        localStorage.setItem('tf_admin_auth', 'true');
        toast({ title: '✅ Welcome back!', description: 'Logged in to TellyFilmy Admin' });
        router.push('/admin');
      } else {
        setIsError(true);
        toast({ title: 'Wrong password', description: 'Please try again.', variant: 'destructive' });
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0B1120] overflow-hidden px-4">
      {/* Animated background blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-orange-500/8 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-rose-500/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }} />

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
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
          
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-rose-500" />

          <div className="p-7 sm:p-9">
            {/* Logo */}
            <div className="text-center mb-8 flex flex-col items-center">
              <Image
                src="/logo.png"
                alt="Telly Filmy"
                width={180}
                height={50}
                priority
                className="h-10 w-auto object-contain mb-3"
              />
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Admin Content Management</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Password field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-300">
                  Admin Password
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
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className={`w-full h-12 pl-10 pr-10 bg-slate-800/80 border rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none transition-all ${
                      isError
                        ? 'border-rose-500/60 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                        : 'border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30'
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
                  <p className="text-xs text-rose-400 flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-rose-400 rounded-full" />
                    Incorrect password. Please try again.
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || !password}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Access Admin Panel
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-slate-600 mt-6">
              🔒 Secured • Unauthorized access is prohibited
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-700 mt-4">
          TellyFilmy CMS v2.0
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
