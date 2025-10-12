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

          <div
            className="whitespace-nowrap animate-scroll flex items-center gap-10 sm:gap-16 lg:gap-20 hover:[animation-play-state:paused]
           text-lightGray md:text-lg lg:text-xl "
          >
            <h3 className="border-2 border-white py-3 px-6">Specialities</h3>
            <h3 className="border-2 border-white py-3 px-6">Homestyle Sushi</h3>
            <h3 className="border-2 border-white py-3 px-6">Steak</h3>
            <h3 className="border-2 border-white py-3 px-6">With Rice</h3>
            <h3 className="border-2 border-white py-3 px-6">Cocktails</h3>
            <h3 className="border-2 border-white py-3 px-6">Appetizer</h3>
            <h3 className="border-2 border-white py-3 px-6">Specialities</h3>
            <h3 className="border-2 border-white py-3 px-6">Homestyle Sushi</h3>
            <h3 className="border-2 border-white py-3 px-6">Steak</h3>
            <h3 className="border-2 border-white py-3 px-6">With Rice</h3>
            <h3 className="border-2 border-white py-3 px-6">Cocktails</h3>
            <h3 className="border-2 border-white py-3 px-6">Appetizer</h3>
          </div>
        </div>
      </section>
    </>
  );
}

export default Specialities;
