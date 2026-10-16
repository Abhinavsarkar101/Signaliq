import React, { useState } from 'react';

interface OnboardingQuestionsProps {
  onComplete: (answers: Record<string, string>) => void;
}

export const OnboardingQuestions: React.FC<OnboardingQuestionsProps> = ({ onComplete }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const questions = [
    { id: 'role', question: 'What is your primary role?', options: ['Founder', 'Product Manager', 'Customer Success', 'Other'] },
    { id: 'goal', question: 'What is your primary goal?', options: ['Reduce Churn', 'Improve Onboarding', 'Feature Prioritization', 'Other'] },
  ];

  const handleSubmit = () => {
    if (Object.keys(answers).length === questions.length) {
      onComplete(answers);
    } else {
      alert('Please answer all questions.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Welcome to SignalIQ!</h2>
        <p className="text-slate-600 mb-6">Please tell us a bit about yourself so we can customize your dashboard.</p>
        
        {questions.map((q) => (
          <div key={q.id} className="mb-4">
            <label className="block text-sm font-semibold text-slate-800 mb-2">{q.question}</label>
            <select 
              className="w-full p-2 border border-slate-300 rounded-lg"
              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            >
              <option value="">Select an option</option>
              {q.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
        
        <button 
          onClick={handleSubmit}
          className="w-full mt-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
        >
          Complete Setup
        </button>
      </div>
    </div>
  );
};
