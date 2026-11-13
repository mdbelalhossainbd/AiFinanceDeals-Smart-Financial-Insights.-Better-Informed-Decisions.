import React, { useState } from 'react';
import { Mail, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export const NewsletterCapture: React.FC = () => {
  const [email, setEmail] = useState('');
  const [cadence, setCadence] = useState<'daily' | 'weekly'>('daily');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }
    setStatus('success');
  };

  return (
    <section id="newsletter" className="w-full bg-[#18191D] text-stone-100 py-12 sm:py-16 border-t border-stone-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-3 font-semibold">
          <Mail className="w-3.5 h-3.5" />
          <span>Institutional Intelligence Briefing</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
          The Daily AI Dealflow Dossier
        </h2>

        <p className="mt-3 text-sm sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
          Delivered every weekday at 06:00 ET. Raw term sheet telemetry, valuation multiple analyses, and exclusive interviews with lead artificial intelligence syndicates.
        </p>

        {status === 'success' ? (
          <div className="mt-8 p-5 bg-stone-900 border border-emerald-500/50 rounded-xl max-w-md mx-auto text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <div className="font-serif text-base font-semibold text-white">
              Executive Subscription Confirmed
            </div>
            <p className="text-xs text-stone-400">
              Your first dispatch will arrive at <span className="text-stone-200 font-mono">{email}</span> tomorrow morning before market open.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 max-w-lg mx-auto space-y-4">
            {/* Cadence Selector (Buttons/Segmented, allowed by §1.A for functional controls) */}
            <div className="inline-flex p-1 bg-stone-900/90 border border-stone-800 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setCadence('daily')}
                className={`px-3.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  cadence === 'daily'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Daily Flash (06:00 ET)
              </button>
              <button
                type="button"
                onClick={() => setCadence('weekly')}
                className={`px-3.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  cadence === 'weekly'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Weekly Strategic Wrap (Sunday)
              </button>
            </div>

            {/* Email Input Field */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="Enter enterprise or partner email..."
                className="flex-1 px-4 py-2.5 rounded-lg bg-stone-900 border border-stone-700 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all font-sans"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {status === 'error' && (
              <p className="text-xs text-rose-400">
                Please provide a valid email address to complete subscription.
              </p>
            )}

            <div className="flex items-center justify-center gap-2 text-xs text-stone-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
              <span>Read by 48,000+ partners at Sequoia, a16z, Nvidia, Goldman Sachs, and sovereign funds.</span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
