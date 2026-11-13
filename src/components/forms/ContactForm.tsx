import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Editorial Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 bg-[#F5F8FC] border border-[#00B894] rounded-2xl text-center space-y-3">
        <CheckCircle2 className="w-12 h-12 text-[#00B894] mx-auto" />
        <h3 className="font-heading font-bold text-xl text-[#0D1F3C]">
          Inquiry Recorded
        </h3>
        <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed">
          Thank you for reaching out to AI Finance Deals. For urgent corrections or direct correspondence, you can also email{' '}
          <a
            href={`mailto:editorial@aifinancedeals.com?subject=${encodeURIComponent(subject)}`}
            className="text-[#163A5F] font-semibold hover:underline"
          >
            editorial@aifinancedeals.com
          </a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div>
        <label className="block font-medium text-[#303846] mb-1">
          Full Name *
        </label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. Eleanor Vance"
          className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00B894] text-[#303846]"
        />
      </div>

      <div>
        <label className="block font-medium text-[#303846] mb-1">
          Email Address *
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. eleanor@example.com"
          className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00B894] text-[#303846]"
        />
      </div>

      <div>
        <label className="block font-medium text-[#303846] mb-1">
          Inquiry Department
        </label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00B894] text-[#303846]"
        >
          <option value="Editorial Inquiry">Editorial & Guide Questions</option>
          <option value="Factual Correction">Factual Correction or Term Sheet Notice</option>
          <option value="Partnership & Advertising">Advertising & Compliance Disclosure</option>
          <option value="Technical Support">Technical & Accessibility Support</option>
        </select>
      </div>

      <div>
        <label className="block font-medium text-[#303846] mb-1">
          Message *
        </label>
        <textarea
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can our financial editorial staff assist you?"
          className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00B894] text-[#303846] resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-[#0D1F3C] hover:bg-[#163A5F] text-white font-heading font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
      >
        <Send className="w-3.5 h-3.5" />
        <span>Send Inquiry</span>
      </button>
    </form>
  );
};
