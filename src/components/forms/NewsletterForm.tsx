import React, { useState } from 'react';
import { Mail, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../integrations/supabase/client';

interface NewsletterFormProps {
  className?: string;
}

export const NewsletterForm: React.FC<NewsletterFormProps> = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [cadence, setCadence] = useState<'daily' | 'weekly'>('weekly');
  const [consentGiven, setConsentGiven] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusNote, setStatusNote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setStatus('error');
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!consentGiven) {
      setStatus('error');
      setErrorMessage('Please confirm your consent to receive our educational newsletter.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('newsletter_subscribers').insert({
          email: cleanEmail,
          cadence,
          consent_recorded: true,
          status: 'active',
        });
        if (error) {
          if (error.code === '23505') {
            setStatus('success');
            setStatusNote('This email address is already registered for our editorial dispatches.');
            return;
          }
          throw error;
        }
        setStatus('success');
        setStatusNote('Your subscription preference has been recorded in our subscriber database.');
        return;
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err?.message || 'Unable to process subscription right now. Please try again shortly.');
        return;
      }
    }

    // Local preview fallback when Supabase env vars are not yet connected
    setStatus('success');
    setStatusNote('Subscription preference captured locally (connect Supabase in production to persist subscriber records).');
  };

  return (
    <section className={`bg-[#0D1F3C] text-white rounded-2xl p-6 sm:p-12 overflow-hidden relative shadow-lg ${className}`}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#163A5F] to-transparent opacity-40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#163A5F] rounded-full text-xs font-mono text-[#00C2E0] font-semibold mb-3">
          <Mail className="w-3.5 h-3.5" />
          <span>Curated Financial Insights</span>
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Make Smarter Financial Decisions Every Week
        </h2>

        <p className="mt-3 text-xs sm:text-sm text-stone-300 leading-relaxed">
          Receive verified bank APY updates, objective insurance analysis, and practical personal finance guides directly from our editorial desk without marketing spam.
        </p>

        {status === 'success' ? (
          <div className="mt-8 p-6 bg-[#163A5F]/80 border border-[#00B894] rounded-xl text-center space-y-2 animate-in fade-in">
            <div className="w-10 h-10 rounded-full bg-[#00B894]/20 text-[#00B894] mx-auto flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">
              Subscription Confirmed
            </h3>
            <p className="text-xs text-stone-300">
              Preferences saved for <span className="font-mono text-white font-semibold">{email}</span>. {statusNote}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setCadence('weekly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  cadence === 'weekly'
                    ? 'bg-[#00B894] text-[#0D1F3C] font-bold shadow'
                    : 'bg-[#163A5F] text-stone-300 hover:text-white'
                }`}
              >
                Weekly Wrap (Recommended)
              </button>
              <button
                type="button"
                onClick={() => setCadence('daily')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  cadence === 'daily'
                    ? 'bg-[#00B894] text-[#0D1F3C] font-bold shadow'
                    : 'bg-[#163A5F] text-stone-300 hover:text-white'
                }`}
              >
                Daily Deal & Rate Alert
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="Enter your primary email address..."
                className="flex-1 px-4 py-3 bg-[#163A5F] border border-[#234A75] rounded-xl text-sm text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#00B894]"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="px-6 py-3 bg-[#00B894] hover:bg-[#009b7c] disabled:opacity-60 text-[#0D1F3C] font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>{status === 'submitting' ? 'Saving...' : 'Subscribe Free'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {status === 'error' && (
              <div className="text-xs text-rose-300 bg-rose-950/40 p-2.5 rounded-lg border border-rose-800">
                {errorMessage}
              </div>
            )}

            <div className="flex items-start gap-2 pt-1 text-[11px] text-stone-300">
              <input
                id="newsletter-consent"
                type="checkbox"
                required
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-0.5 rounded border-stone-600 bg-[#163A5F] text-[#00B894] focus:ring-[#00B894]"
              />
              <label htmlFor="newsletter-consent" className="cursor-pointer select-none">
                I agree to receive financial education emails from AI Finance Deals. I understand that I can unsubscribe at any time. Read our{' '}
                <Link to="/privacy-policy/" className="text-[#00C2E0] hover:underline">
                  Privacy Policy
                </Link>.
              </label>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
