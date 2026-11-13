import React, { useState } from 'react';
import { X, CheckCircle2, Shield, UploadCloud } from 'lucide-react';
import { DealStage } from '../types';

interface SubmitDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (data: { company: string; amount: string; stage: string }) => void;
}

export const SubmitDealModal: React.FC<SubmitDealModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const [company, setCompany] = useState('');
  const [amount, setAmount] = useState('');
  const [stage, setStage] = useState<DealStage>('Series A');
  const [leadInvestor, setLeadInvestor] = useState('');
  const [sourceEmail, setSourceEmail] = useState('');
  const [details, setDetails] = useState('');
  const [isConfidential, setIsConfidential] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !amount.trim()) return;

    setSubmitted(true);
    onSubmitSuccess({ company, amount, stage });

    setTimeout(() => {
      setSubmitted(false);
      setCompany('');
      setAmount('');
      setLeadInvestor('');
      setSourceEmail('');
      setDetails('');
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center p-3 sm:p-6 transition-all animate-in fade-in duration-200">
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-[#FAF9F5] dark:bg-[#15171B] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto p-6 sm:p-8 text-stone-900 dark:text-stone-100">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold">
              Editorial Syndicate Desk
            </div>
            <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
              Submit Breaking AI Deal
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-white rounded-md transition-colors"
            aria-label="Close submit modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
              Deal Tip Received
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 max-w-sm mx-auto">
              Our market intelligence desk will verify the financing details against SEC filings and lead syndicates within 2 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                Company / Startup Name *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. TensorCore AI"
                className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md focus:ring-1 focus:ring-stone-900 dark:focus:ring-amber-400 outline-none text-stone-900 dark:text-stone-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Capital Raised ($) *
                </label>
                <input
                  type="text"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. $45M"
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md focus:ring-1 focus:ring-stone-900 dark:focus:ring-amber-400 outline-none text-stone-900 dark:text-stone-100 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Funding Stage
                </label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as DealStage)}
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md focus:ring-1 focus:ring-stone-900 dark:focus:ring-amber-400 outline-none text-stone-900 dark:text-stone-100"
                >
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B">Series B</option>
                  <option value="Series C+">Series C+</option>
                  <option value="Growth">Growth / Late</option>
                  <option value="M&A">M&A / Buyout</option>
                  <option value="IPO">IPO / Pre-IPO</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                Lead Investor(s)
              </label>
              <input
                type="text"
                value={leadInvestor}
                onChange={(e) => setLeadInvestor(e.target.value)}
                placeholder="e.g. Sequoia, Founders Fund, a16z"
                className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md focus:ring-1 focus:ring-stone-900 dark:focus:ring-amber-400 outline-none text-stone-900 dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                Your Email (Confidential / Embargo Source)
              </label>
              <input
                type="email"
                value={sourceEmail}
                onChange={(e) => setSourceEmail(e.target.value)}
                placeholder="associate@firm.com or founder@company.ai"
                className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md focus:ring-1 focus:ring-stone-900 dark:focus:ring-amber-400 outline-none text-stone-900 dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                Key Details / Term Sheet Highlights
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Valuation multiple, ARR milestones, compute commitments, syndicate co-leads..."
                className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md focus:ring-1 focus:ring-stone-900 dark:focus:ring-amber-400 outline-none text-stone-900 dark:text-stone-100 resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1 text-stone-500 dark:text-stone-400">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px]">
                Sources protected under editorial journalist shield laws. Embargoes strictly respected.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-semibold text-white bg-stone-900 dark:bg-amber-600 hover:bg-stone-800 dark:hover:bg-amber-500 rounded-md transition-colors cursor-pointer shadow-sm"
              >
                Transmit Deal Tip
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
