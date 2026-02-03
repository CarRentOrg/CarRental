import { RENTAL_TERMS } from "@/constants";
import Button from "../shared/button";
import { useLanguage } from "@/contexts/LanguageContext";

const RentalTermsSection = () => {
  const { t } = useLanguage();
  return (
    <section
      id="rental-terms"
      className="mt-10 sm:mt-32 p-9 lg:p-15 border-t border-neutral-800/50 bg-[#0e0e0e] rounded-4xl"
    >
      <div className="flex flex-col md:flex-row gap-16 items-start">
        {/* Left Side */}
        <div className="md:flex-1 w-full space-y-4 sm:space-y-6">
          <h2 className="text-4xl font-light tracking-tight">Rental Terms</h2>

          <p className="text-neutral-400 font-light max-w-sm">
            We're here for you — ready to help find the perfect car that matches
            your needs.
          </p>

          <div className="flex items-center gap-4 pt-4">
            <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden">
              <span className="text-lg font-medium">MC</span>
            </div>

            <div>
              <p className="font-medium text-white">Michael Carter</p>
              <p className="text-sm text-neutral-500">
                Your Personal Rental Assistant
              </p>
            </div>
          </div>

          <Button text="Call Us Now" className="mt-4 px-6 py-3" />
        </div>

        {/* Right Side */}
        <div className="md:flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {RENTAL_TERMS.map((term, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#171717] backdrop-blur-sm
                         border border-neutral-800/50
                         hover:border-neutral-700/70
                         transition-all duration-500"
            >
              <term.icon className="h-5 w-5 text-neutral-400 mb-4" />
              <p className="text-lg font-medium text-white">{t(term.title)}</p>
              <p className="text-sm text-neutral-500">{t(term.subtitle)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RentalTermsSection;
