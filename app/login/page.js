'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CheckSquare, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in both fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        await signUp(email.trim(), password);
        setSuccess('Account created! You can now sign in.');
        setMode('signin');
        setPassword('');
      } else {
        await signIn(email.trim(), password);
        router.push('/');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface-primary relative overflow-hidden px-4">
      {/* Animated background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #bf5af2, transparent 70%)' }}
        />
        <div className="absolute bottom-[-150px] right-[-80px] w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #0071e3, transparent 70%)' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #30d158, transparent 70%)' }}
        />
      </div>

      {/* Login card */}
      <div className="relative w-full max-w-[420px] animate-modal-in">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-[56px] h-[56px] rounded-[16px] bg-white/5 border border-border-hairline backdrop-blur-xl shadow-xl">
            <CheckSquare className="text-white w-[28px] h-[28px]" />
          </div>
          <div className="text-center">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-white">
              Celite Manager
            </h1>
            <p className="text-sm text-text-secondary mt-1 flex items-center justify-center gap-1.5">
              <Sparkles size={13} className="text-accent-purple" />
              Tasks, finances & notes — powered by AI
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-surface-panel/80 backdrop-blur-3xl border border-border-hairline rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Mode toggle */}
          <div className="relative flex bg-white/5 border border-border-hairline rounded-full p-[3px] mb-6">
            <button
              type="button"
              className={`relative z-10 flex-1 py-2 border-none bg-transparent font-heading text-sm font-medium cursor-pointer rounded-full transition-colors text-center ${
                mode === 'signin' ? 'text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`relative z-10 flex-1 py-2 border-none bg-transparent font-heading text-sm font-medium cursor-pointer rounded-full transition-colors text-center ${
                mode === 'signup' ? 'text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
            >
              Sign Up
            </button>
            <div
              className="absolute top-[3px] left-[3px] w-[calc(50%-3px)] h-[calc(100%-6px)] bg-white/10 rounded-full transition-transform duration-300 ease-out pointer-events-none"
              style={{
                transform: mode === 'signin' ? 'translateX(0)' : 'translateX(100%)',
              }}
            />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
                <Mail size={12} /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full bg-surface-input border border-transparent rounded-lg text-white px-4 py-3 font-body text-sm outline-none transition-all focus:bg-white/[0.08] focus:border-border-focus focus:shadow-[0_0_0_3px_rgba(0,113,227,0.1)] placeholder:text-text-muted"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
                <Lock size={12} /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder={mode === 'signup' ? 'Min 6 characters' : 'Your password'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  className="w-full bg-surface-input border border-transparent rounded-lg text-white px-4 py-3 pr-11 font-body text-sm outline-none transition-all focus:bg-white/[0.08] focus:border-border-focus focus:shadow-[0_0_0_3px_rgba(0,113,227,0.1)] placeholder:text-text-muted"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-text-muted cursor-pointer hover:text-text-secondary transition-colors p-0"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-accent-red text-xs bg-accent-red/10 border border-accent-red/20 rounded-lg px-3 py-2.5 animate-spring-load">
                <span className="flex-shrink-0">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center gap-2 text-accent-green text-xs bg-accent-green/10 border border-accent-green/20 rounded-lg px-3 py-2.5 animate-spring-load">
                <span className="flex-shrink-0">✓</span>
                <span>{success}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg border-none font-heading text-sm font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 mt-1 ${
                loading
                  ? 'bg-white/10 text-text-muted cursor-not-allowed'
                  : 'bg-gradient-to-r from-accent-purple to-accent-blue text-white shadow-[0_4px_20px_rgba(191,90,242,0.25)] hover:shadow-[0_4px_28px_rgba(191,90,242,0.4)] hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer text */}
        <p className="text-center text-[0.7rem] text-text-muted mt-5">
          {mode === 'signin'
            ? "Don't have an account? Switch to Sign Up above."
            : 'Already have an account? Switch to Sign In above.'}
        </p>
      </div>
    </div>
  );
}
