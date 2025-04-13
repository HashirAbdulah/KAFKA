'use client';
import { useState } from 'react';

const faqs = [
  {
    question: 'How do I contact a landlord?',
    answer: 'Use the “Contact” button on the landlord’s profile page to send a direct message.',
  },
  {
    question: 'What if I can’t log into my account?',
    answer: 'Click “Forgot Password” on the login screen. Still stuck? Reach out to support below.',
  },
  {
    question: 'How do I list my property?',
    answer: 'Navigate to the dashboard and click “Add Property” in the sidebar.',
  },
];

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-[#EBEBEB] rounded-lg overflow-hidden shadow-sm transition hover:shadow-md"
          >
            <button
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              className="w-full text-left px-6 py-4 text-lg font-medium text-[#222222] hover:bg-[#FAFAFA]"
            >
              {faq.question}
            </button>
            {activeIndex === index && (
              <div className="px-6 pb-4 text-[#717171] text-base">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
