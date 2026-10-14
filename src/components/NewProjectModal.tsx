import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { Project } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (projectData: Partial<Project>) => Promise<void>;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('');
  const [productName, setProductName] = useState('');
  const [customerSegment, setCustomerSegment] = useState('');
  const [businessContext, setBusinessContext] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');
  const [category, setCategory] = useState('onboarding');
  const [errors, setErrors] = useState<{ name?: string; objective?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingObjective, setIsGeneratingObjective] = useState(false);

  if (!isOpen) return null;

  const handleGenerateObjective = async () => {
    setIsGeneratingObjective(true);
    try {
      const suggestion = await (await import('../lib/api')).api.suggestObjective({
        topic: objective.trim() || name.trim() || category,
        category,
        productName: productName.trim() || undefined,
      });

      if (suggestion) {
        if (!name.trim() || name === 'Untitled Project') setName(suggestion.name);
        setObjective(suggestion.objective);
        if (suggestion.customerSegment && !customerSegment.trim()) setCustomerSegment(suggestion.customerSegment);
        if (suggestion.businessContext && !businessContext.trim()) setBusinessContext(suggestion.businessContext);
        if (suggestion.desiredOutcome && !desiredOutcome.trim()) setDesiredOutcome(suggestion.desiredOutcome);
        setErrors({});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingObjective(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; objective?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please provide a project name.';
    }
    if (!objective.trim()) {
      newErrors.objective = 'Please define a research objective or business question.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate({
        name: name.trim(),
        objective: objective.trim(),
        productName: productName.trim() || undefined,
        customerSegment: customerSegment.trim() || undefined,
        businessContext: businessContext.trim() || undefined,
        desiredOutcome: desiredOutcome.trim() || undefined,
        category,
        status: 'draft',
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreFillExample = () => {
    setName('Mobile Checkout Drop-Off Friction Investigation');
    setObjective(
      'Identify why 42% of mobile shoppers abandon during the payment step after adding items to cart.'
    );
    setProductName('ShopWave E-Commerce App');
    setCustomerSegment('Mobile web & iOS users shopping in the US region');
    setBusinessContext('Cart-to-checkout conversion decreased by 6.2% following the v3.4 redesign.');
    setDesiredOutcome('Establish top payment gateway friction issues and validate potential UX fixes.');
    setCategory('conversion');
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Research Project</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Define the core customer problem you want to investigate.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePreFillExample}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              Fill Sample Example
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5 max-h-[75vh] overflow-y-auto">
          {/* Required: Project Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Project Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="e.g. Onboarding Drop-off Analysis or Checkout Friction"
              className={`w-full px-3.5 py-2.5 rounded-lg text-sm border focus:outline-hidden focus:ring-2 transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                errors.name
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-900'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-600 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Required: Research Objective */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Research Objective / Business Question <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleGenerateObjective}
                disabled={isGeneratingObjective}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center space-x-1 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingObjective ? 'animate-spin' : ''}`} />
                <span>{isGeneratingObjective ? 'Generating...' : 'AI Generate / Polish Objective'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={objective}
              onChange={(e) => {
                setObjective(e.target.value);
                if (errors.objective) setErrors((prev) => ({ ...prev, objective: undefined }));
              }}
              placeholder="e.g. Understand why new customers abandon the onboarding process before completing setup."
              className={`w-full px-3.5 py-2.5 rounded-lg text-sm border focus:outline-hidden focus:ring-2 transition-all resize-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                errors.objective
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-900'
              }`}
            />
            {errors.objective && (
              <p className="mt-1 text-xs text-rose-600 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.objective}</span>
              </p>
            )}
            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              Be specific about what decision you are trying to make. SignalIQ will formulate a structured AI brief based on this question.
            </p>
          </div>

          {/* Grid of Optional Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Product or Service Name <span className="text-slate-400 text-[11px] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. CloudDesk SaaS, Mobile App"
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Research Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="onboarding">Onboarding</option>
                <option value="retention">Retention & Churn</option>
                <option value="customer satisfaction">Customer Satisfaction (CSAT/NPS)</option>
                <option value="feature adoption">Feature Adoption & UX</option>
                <option value="conversion">Funnel Conversion</option>
                <option value="pricing">Pricing & Packaging</option>
                <option value="general">General Feedback</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Target Customer Segment <span className="text-slate-400 text-[11px] font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={customerSegment}
              onChange={(e) => setCustomerSegment(e.target.value)}
              placeholder="e.g. New customers who started onboarding during the previous 30 days"
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Business Context <span className="text-slate-400 text-[11px] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={businessContext}
                onChange={(e) => setBusinessContext(e.target.value)}
                placeholder="e.g. Recent drop in activation rate"
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Desired Outcome <span className="text-slate-400 text-[11px] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={desiredOutcome}
                onChange={(e) => setDesiredOutcome(e.target.value)}
                placeholder="e.g. Identify top 3 friction points"
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold shadow-xs shadow-indigo-200 dark:shadow-none transition-all cursor-pointer"
            >
              <span>{isSubmitting ? 'Creating...' : 'Create & Open Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
