import { RENTAL_TERMS } from "@/constants";
import Button from "../shared/button";

const RentalTermsSection = () => {
  return (
    <section className="mt-32 py-20 border-t border-neutral-800/50 bg-[#0e0e0e] rounded-4xl">
      <div className=" mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side */}
          <div className="space-y-6">
            <h2 className="text-4xl font-light tracking-tight">Rental Terms</h2>
            <p className="text-neutral-400 font-light max-w-sm">
              We're here for you — ready to help find the perfect car that
              matches your needs.
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

          {/* Right Side - Terms Grid */}
          <div className="grid grid-cols-2 gap-4">
            {RENTAL_TERMS.map((term, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#171717] backdrop-blur-sm border border-neutral-800/50 hover:border-neutral-700/70 transition-all duration-500"
              >
                <term.icon className="h-5 w-5 text-neutral-400 mb-4" />
                <p className="text-lg font-medium text-white">{term.title}</p>
                <p className="text-sm text-neutral-500">{term.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RentalTermsSection;
