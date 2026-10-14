import React, { useState } from 'react';
import { Mail, AlertCircle, Copy, Check, ExternalLink, X } from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyUrl: string;
  surveyTitle: string;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  surveyUrl,
  surveyTitle,
}) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Distribute Survey</h3>
              <p className="text-xs text-slate-500">{surveyTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Honest Email Status Warning (Scenario 10 / AC-07.10) */}
        <div className="p-4 bg-amber-50 border border-amber-200/90 rounded-xl space-y-2 text-xs text-amber-900">
          <div className="flex items-center space-x-2 font-bold text-amber-950">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Email Provider Service Not Configured</span>
          </div>
          <p className="leading-relaxed">
            Automated outbound SMTP / SendGrid email delivery is not configured in this development environment.
            SignalIQ does not claim to send emails when credentials are not present.
          </p>
          <p className="font-semibold text-amber-950">
            You can distribute your published survey manually by copying the shareable respondent URL below.
          </p>
        </div>

        {/* Shareable Link Box */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Shareable Survey URL
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={surveyUrl}
              className="flex-1 text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 select-all"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Manual email distribution test input */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <label className="block text-xs font-medium text-slate-600">
            Simulate Email List Preparation (Optional)
          </label>
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="e.g. user@example.com, team@company.com"
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:border-indigo-500"
          />
          <p className="text-[11px] text-slate-400">
            To integrate a real email service (such as Postmark, Resend, or SendGrid), enter API credentials in your server environment variables.
          </p>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
