import React from "react";

function Specialities() {
  return (
    <>
      <section className="overflow-hidden px-4 sm:px-6 md:px-8 py-6 md:py-16 lg:px-16">
        <div className="space-y-16">
          <div className="text-center max-w-md md:max-w-lg mx-auto space-y-2 md:space-y-6">
            <span className="font-greatVibes text-sm md:text-lg lg:text-xl text-white tracking-[0.2rem] md:tracking-[0.4rem]">
              Quality Food For You
            </span>

            <h2 className="font-bold font-cinzel text-xl md:text-[clamp(1.2rem,5vw,3rem)] text-softBeigeYellow">
              Our Specialities
            </h2>

            <p className="text-lightGray md:text-lg lg:text-xl">
              Authentic food from our restaurant served with high quality
              ingredients
            </p>
          </div>

          <div className="relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-darkCharcoal to-transparent pointer-events-none z-20"></div>
            <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-darkCharcoal to-transparent pointer-events-none z-20"></div>

            <div className="flex animate-scroll gap-8 lg:gap-12 py-4">
              {[...Array(3)].map(
                (
                  _,
                  repeat // repeat for seamless loop
                ) =>
                  [
                    "Specialities",
                    "Homestyle Sushi",
                    "Steak",
                    "With Rice",
                    "Cocktails",
                    "Appetizer",
                  ].map((item, idx) => (
                    <div
                      key={`${repeat}-${idx}`}
                      className="flex-none bg-gradient-to-br from-softBeigeYellow/10 to-softBeigeYellow/30 border border-softBeigeYellow rounded-xl py-2 px-6 lg:py-3 lg:px-8 text-white md:text-lg font-semibold shadow-xl transform transition-transform duration-500 hover:scale-110"
                    >
                      {item}
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Specialities;
