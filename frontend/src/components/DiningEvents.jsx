import React from "react";

const diningEvents = [
  {
    id: "1",
    price: "$500",
    title: "Fine Dining",
    text: "Bottle of Champagne Fine Sushi Tower For 2+ Dessert",
    image: "images/fine-dining.webp",
  },

  {
    id: "2",
    price: "$1000",
    title: "Gold Dining",
    text: "Bottle of Champagne Secret Menu Sushi For 2+ Dessert",
    image: "images/gold-dining.webp",
  },

  {
    id: "3",
    price: "$1500",
    title: "Royality Dining",
    text: "Bottle of Luxury Champagne Special Menu Sushi For 2+ Royal Dessert",
    image: "images/royality-dining.webp",
  },
];

function DiningEvents() {
  return (
    <>
      <section
        id="dining"
        className="px-4 sm:px-6 md:px-8 py-10 md:py-20 lg:py-28 lg:px-16 scroll-mt-10"
      >
        <div className="space-y-6 lg:space-y-16">
          <div className="text-center max-w-md md:max-w-lg mx-auto space-y-2 md:space-y-6">
            <span className="font-greatVibes text-sm md:text-lg lg:text-xl text-white tracking-[0.2rem] md:tracking-[0.4rem]">
              Choose Your Event
            </span>

            <h2 className="font-bold font-cinzel text-xl md:text-[clamp(1.2rem,5vw,3rem)] text-softBeigeYellow">
              Dining Events
            </h2>

            <p className="text-lightGray md:text-lg lg:text-xl">
              We provide dining event for your special day with your important
              people
            </p>

            <div className="flex flex-wrap gap-4 md:gap-6 justify-center items-center pt-6">
              <p
                className="text-darkCharcoal bg-goldYellow  transition-colors duration-300 md:text-lg lg:text-xl py-2 px-3
                md:py-3 md:px-6"
              >
                Private Events
              </p>
              <p
                className="text-white border-2 border-white md:text-lg lg:text-xl py-2 px-3
                md:py-3 md:px-6 transition-colors duration-300"
              >
                Corporate Events
              </p>
            </div>
          </div>

          <div className="">
            {diningEvents.map((diningEvent, id) => (
              <div
                className="max-w-lg md:max-w-6xl mx-auto py-6 md:py-0"
                key={id}
              >
                <div
                  className={`flex flex-col md:flex-row md:justify-center md:items-center gap-4 md:gap-6 lg:gap-8 ${diningEvent.id === "2" ? "md:flex-row-reverse" : ""}`}
                >
                  <div className="">
                    <img
                      src={diningEvent.image}
                      alt={diningEvent.title}
                      className="md:h-60 lg:h-72 xl:h-[21.875rem] max-w-full object-cover bg-deepGray"
                      width={625}
                      height={350}
                    />
                  </div>

                  <div className="md:max-w-[18.75rem] lg:max-w-[25rem] space-y-2 md:space-y-4">
                    <h3 className="font-bold font-cinzel text-lg md:text-xl xl:text-2xl text-softBeigeYellow">
                      {diningEvent.title}
                    </h3>

                    <p className="text-lightGray lg:text-lg xl:text-xl">
                      {diningEvent.text}
                    </p>

                    <h4 className="font-bold font-cinzel text-xl xl:text-3xl text-softBeigeYellow">
                      {diningEvent.price}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default DiningEvents;
