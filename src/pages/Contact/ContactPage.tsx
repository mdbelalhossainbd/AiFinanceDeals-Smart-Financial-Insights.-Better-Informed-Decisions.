import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { MetaTags } from '../../components/seo/MetaTags';
import { ContactForm } from '../../components/forms/ContactForm';
import { Mail, Clock, ShieldCheck, MapPin } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const breadcrumbs = [{ label: 'Contact Us' }];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <MetaTags
        title="Contact Us — AI Finance Deals Editorial Staff"
        description="Get in touch with the editors, researchers, and financial analysts at AI Finance Deals for inquiries, corrections, and reader questions."
        canonicalPath="/contact/"
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-[#00B894] font-semibold">
          Reader & Media Inquiries
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0D1F3C]">
          Contact AI Finance Deals
        </h1>
        <p className="text-xs sm:text-sm text-[#4B5563] max-w-2xl leading-relaxed">
          We welcome questions from readers, suggestions for new guides, and inquiries regarding factual verification and editorial accuracy.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="font-heading text-lg font-bold text-[#0D1F3C] mb-4">
            Transmit an Editorial Inquiry
          </h2>
          <ContactForm />
        </div>

        <div className="md:col-span-5 space-y-6">
          <div className="bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl p-6 space-y-4">
            <h3 className="font-heading font-bold text-base text-[#0D1F3C]">
              Direct Editorial Channels
            </h3>

            <div className="space-y-3 text-xs text-[#4B5563]">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#163A5F] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#0D1F3C] block">Editorial & Corrections Desk</span>
                  <span className="font-mono text-[#6B7280]">editorial@aifinancedeals.com</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#00B894] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#0D1F3C] block">Compliance & Fact-Checking</span>
                  <span className="font-mono text-[#6B7280]">compliance@aifinancedeals.com</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#163A5F] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#0D1F3C] block">Response Hours</span>
                  <span>Monday – Friday: 08:00 – 18:00 ET</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#6B7280] space-y-2">
            <span className="font-bold text-[#0D1F3C] block">Corrections Policy</span>
            <p className="leading-relaxed">
              If you detect an out-of-date interest rate, inaccurate fee disclosure, or broken link, please select "Factual Correction" in the inquiry form with the respective URL. We correct verified discrepancies within 24 business hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
