import React from 'react';
import HeroSection from './components/HeroSection';
import FaqSection from './components/FaqSection';
import TroubleshootingSection from './components/TroubleshootingSection';
import SupportInfoSection from './components/SupportInfoSection';

const HelpCenterPage = () => {
  return (
    <main className="bg-white min-h-screen text-[#222222] px-6 py-12 max-w-4xl mx-auto">
      <HeroSection />
      <div className="divide-y divide-[#EBEBEB] space-y-12">
        <FaqSection />
        <TroubleshootingSection />
        <SupportInfoSection />
      </div>
    </main>
  );
};

export default HelpCenterPage;
