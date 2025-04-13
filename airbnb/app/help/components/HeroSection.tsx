const HeroSection = () => (
  <section className="text-center mb-12">
    <h1 className="text-4xl font-bold mb-3 text-[#222222]">Help Center</h1>
    <p className="text-lg text-[#717171] mb-6">
      We're here to help. Browse FAQs or reach out if you need assistance.
    </p>
    <div className="max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search FAQs or topics..."
        className="w-full px-4 py-2 border border-[#EBEBEB] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
      />
    </div>
  </section>
);

export default HeroSection;
