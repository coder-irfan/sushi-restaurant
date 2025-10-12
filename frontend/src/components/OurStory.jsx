import React from "react";

function OurStory() {
  return (
    <>
      <section
        id="story"
        className="px-4 sm:px-6 md:px-8 pt-6 pb-16 md:pb-20 lg:pb-24 lg:px-16 scroll-mt-32"
      >
        <div className="space-y-12">
          <div className="text-center max-w-md md:max-w-lg mx-auto space-y-2 md:space-y-6">
            <span className="font-greatVibes text-sm md:text-lg lg:text-xl text-white tracking-[0.2rem] md:tracking-[0.4rem]">
              About Us
            </span>

            <h2 className="font-bold font-cinzel text-xl md:text-[clamp(1.2rem,5vw,3rem)] text-softBeigeYellow">
              Our Story
            </h2>

            <p className="text-lightGray md:text-lg lg:text-xl">
              A journey for making successful luxury restaurant with the best
              services
            </p>
          </div>

          <div className="flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-10">
            <img
              src="images/three-people-in-kitchen.webp"
              alt="three-people-in-kitchen"
              className="w-full max-w-[31.25rem]"
            />

            <div className="max-w-[31.25rem] lg:max-w-[25rem] xl:max-w-[31.25rem] space-y-6 lg:space-y-10 text-center lg:text-left">
              <p className="text-lightGray md:text-lg lg:text-xl">
                Founded in the heart of the city, Ocean Bloom Sushi brings
                together tradition and creativity in every bite. Our chefs craft
                each roll with the finest seafood and farm-fresh vegetables,
                ensuring flavors that are as vibrant as our atmosphere.
              </p>

              <p className="text-lightGray md:text-lg lg:text-xl">
                Whether you’re a sushi enthusiast or trying it for the first
                time, we promise an unforgettable dining experience. Join us and
                discover why our guests keep coming back for more.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default OurStory;
