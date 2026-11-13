import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isSupabaseConfigured } from '../../integrations/supabase/client';
import { Lock, Mail, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';

const ALLOW_LOCAL_DEMO_HINT = import.meta.env.DEV && !isSupabaseConfigured;

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState(ALLOW_LOCAL_DEMO_HINT ? 'admin@aifinancedeals.com' : '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.error || 'Authentication failed');
      }
    } catch (err: any) {
      setError(err.message || 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <BrandLogo showTagline={true} className="justify-center mb-2" />
          <h1 className="font-heading text-xl font-bold text-[#0D1F3C]">
            Editorial CMS Authentication
          </h1>
          <p className="text-xs text-[#6B7280]">
            Sign in to manage articles, fact-check queues, categories, and financial product deals.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-rose-900 shrink-0">Sign-in Notice:</span>
              <span>{error}</span>
            </div>
            {ALLOW_LOCAL_DEMO_HINT && (
              <div className="pt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@aifinancedeals.com');
                    setPassword('admin123');
                    setError('');
                  }}
                  className="text-[11px] font-semibold text-rose-700 bg-white border border-rose-200 hover:bg-rose-100/50 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                >
                  Autofill Admin Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('editor@aifinancedeals.com');
                    setPassword('editor123');
                    setError('');
                  }}
                  className="text-[11px] font-semibold text-rose-700 bg-white border border-rose-200 hover:bg-rose-100/50 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                >
                  Autofill Editor Login
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-[#303846] mb-1">
              Editor Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#CBD5E1] rounded-lg text-[#303846] focus:outline-none focus:ring-1 focus:ring-[#00B894]"
              />
              <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#303846] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#CBD5E1] rounded-lg text-[#303846] focus:outline-none focus:ring-1 focus:ring-[#00B894]"
              />
              <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0D1F3C] hover:bg-[#163A5F] text-white font-heading font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-60"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Demo Credentials Box (Shown strictly in unconfigured local dev preview) */}
        {ALLOW_LOCAL_DEMO_HINT && (
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0D1F3C] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00B894]" />
                Local Dev Preview Accounts:
              </span>
              <span className="text-[10px] text-[#6B7280] bg-white border border-[#E2E8F0] px-2 py-0.5 rounded-full">
                Click to autofill
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@aifinancedeals.com');
                  setPassword('admin123');
                  setError('');
                }}
                className="text-left p-2.5 bg-white hover:bg-emerald-50/50 border border-[#E2E8F0] hover:border-[#00B894] rounded-lg transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#0D1F3C] text-[11px] group-hover:text-[#00B894]">Administrator</span>
                  <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-medium">Full Access</span>
                </div>
                <div className="font-mono text-[10px] text-[#475569] truncate">admin@aifinancedeals.com</div>
                <div className="font-mono text-[10px] text-[#64748B]">Dev Preview Role</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('editor@aifinancedeals.com');
                  setPassword('editor123');
                  setError('');
                }}
                className="text-left p-2.5 bg-white hover:bg-cyan-50/50 border border-[#E2E8F0] hover:border-[#00C2E0] rounded-lg transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#0D1F3C] text-[11px] group-hover:text-[#00C2E0]">Managing Editor</span>
                  <span className="text-[9px] font-mono bg-cyan-100 text-cyan-800 px-1.5 py-0.2 rounded font-medium">Content Role</span>
                </div>
                <div className="font-mono text-[10px] text-[#475569] truncate">editor@aifinancedeals.com</div>
                <div className="font-mono text-[10px] text-[#64748B]">Dev Preview Role</div>
              </button>
            </div>
          </div>
        )}

        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-[#6B7280] hover:text-[#0D1F3C] inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>Return to public website</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
