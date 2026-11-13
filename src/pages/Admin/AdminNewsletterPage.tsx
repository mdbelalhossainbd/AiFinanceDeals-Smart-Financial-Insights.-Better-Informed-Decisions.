import React, { useEffect, useState } from 'react';
import { Mail, Download, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../integrations/supabase/client';

interface SubscriberRow {
  id: string;
  email: string;
  cadence: string;
  consent_recorded: boolean;
  status: string;
  created_at: string;
}

export const AdminNewsletterPage: React.FC = () => {
  const [subscribers, setSubscribers] = useState<SubscriberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadSubscribers() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('newsletter_subscribers')
          .select('id, email, cadence, consent_recorded, status, created_at')
          .order('created_at', { ascending: false });

        if (error) {
          setErrorMsg(error.message);
        } else if (data) {
          setSubscribers(data as SubscriberRow[]);
        }
      } catch (err: any) {
        setErrorMsg(err?.message || 'Unable to query subscriber records.');
      } finally {
        setLoading(false);
      }
    }
    loadSubscribers();
  }, []);

  const handleExportCSV = () => {
    if (subscribers.length === 0) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Email,Cadence,Consent,Status,Date\n' +
      subscribers
        .map(
          (e) =>
            `${e.email},${e.cadence},${e.consent_recorded},${e.status},${new Date(e.created_at).toISOString().split('T')[0]}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'aifinancedeals_subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotification('Subscriber export initiated: aifinancedeals_subscribers.csv');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#0D1F3C]">
            Newsletter Audience & Consent Logs
          </h1>
          <p className="text-xs text-[#6B7280]">
            Verified email subscriptions stored in Supabase with explicit opt-in consent timestamps.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={subscribers.length === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D1F3C] hover:bg-[#163A5F] disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export Subscriber CSV</span>
        </button>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between text-xs">
          <span className="font-semibold text-[#0D1F3C]">
            Verified Subscribers ({subscribers.length})
          </span>
          <span className="font-mono text-[#00B894] font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> RLS Protected Table
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[#6B7280]">Loading subscriber records...</div>
        ) : subscribers.length === 0 ? (
          <div className="p-8 text-center space-y-2 text-xs text-[#6B7280]">
            <Mail className="w-6 h-6 text-[#9CA3AF] mx-auto" />
            <p className="font-semibold text-[#0D1F3C]">
              {isSupabaseConfigured
                ? 'No newsletter subscribers recorded yet.'
                : 'Supabase not connected in this environment.'}
            </p>
            <p className="max-w-md mx-auto">
              Real opt-in records populate here once `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured and readers submit the subscription form.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#6B7280]">
                <tr>
                  <th className="p-4 font-semibold">Subscriber Email</th>
                  <th className="p-4 font-semibold">Cadence</th>
                  <th className="p-4 font-semibold">Explicit Consent</th>
                  <th className="p-4 font-semibold">Subscribed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[#303846]">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="p-4 font-medium text-[#0D1F3C]">{sub.email}</td>
                    <td className="p-4 font-mono uppercase text-[11px]">{sub.cadence}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700">
                        {sub.consent_recorded ? 'Consent Logged' : 'Missing'}
                      </span>
                    </td>
                    <td className="p-4 text-[#6B7280] font-mono text-[11px]">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
