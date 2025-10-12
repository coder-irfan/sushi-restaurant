import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function SpecialMenu({ cartItems, setCartItems, increase, decrease }) {
  const [sushis, setSushis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  // Fetching datas
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${import.meta.env.VITE_API_URL}/api/sushi`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch sushis!");
        return res.json();
      })
      .then((data) => {
        setSushis(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not load sushis. Please try again!");
        toast.error("Could not load sushis. Please try again!");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <section
        id="menu"
        className="px-4 sm:px-6 md:px-8 py-10 sm:py-14 lg:py-24 lg:px-16 max-w-7xl mx-auto"
      >
        <div className="space-y-8 lg:space-y-14">
          <div className="text-center max-w-md md:max-w-lg mx-auto space-y-2">
            <span className="font-greatVibes text-sm md:text-lg lg:text-xl text-white tracking-[0.2rem] md:tracking-[0.4rem]">
              Special Menu
            </span>

            <h2 className="font-bold font-cinzel text-xl md:text-[clamp(1.2rem,5vw,3rem)] text-softBeigeYellow leading-[1.2]">
              Today’s Special
            </h2>

            <p className="text-lightGray md:text-lg lg:text-xl max-w-80 mx-auto md:max-w-full">
              Special menu oftenly comes different everyday, this is our special
              food for today
            </p>
          </div>

          <div className="">
            {loading && (
              <div className="flex justify-center items-center gap-2 md:gap-3">
                <span className="text-lightGray text-lg md:text-xl lg:text-2xl xl:text-3xl text-center">
                  Loading Sushis
                </span>
                <div className="flex justify-center items-center gap-1 md:gap-2">
                  <div className="w-2 h-2 bg-goldYellow rounded-full animate-bounce1"></div>
                  <div className="w-2 h-2 bg-goldYellow rounded-full animate-bounce2"></div>
                  <div className="w-2 h-2 bg-goldYellow rounded-full animate-bounce3"></div>
                </div>
              </div>
            )}
            {error && <p className="text-red text-lg text-center">{error}</p>}
            {!loading && !error && sushis.length === 0 && (
              <p className="text-red md:text-lg text-center">
                No sushis found!
              </p>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 place-items-center gap-4">
              {!loading &&
                !error &&
                sushis.slice(0, visibleCount).map((sushi) => (
                  <div
                    className="max-w-[28.125rem] lg:max-w-96 flex flex-col h-full w-full bg-deepGray"
                    key={sushi._id}
                  >
                    <div className="relative">
                      <img
                        src={`${import.meta.env.VITE_API_URL}${sushi.img}`}
                        alt={sushi.title}
                        className="h-52 xl:h-72 w-full object-cover bg-deepGray"
                        width={375}
                        height={290}
                      />
                      {cartItems.find((i) => i._id === sushi._id)?.qty > 0 ? (
                        <div className="absolute bottom-4 right-4 flex items-center gap-3 bg-softBeigeYellow p-1.5 rounded-full">
                          <img
                            className="cursor-pointer bg-deepGray py-2.5 px-1.5 rounded-full w-7 hover:bg-darkCharcoal transition-colors duration-300"
                            src="images/minus-icon.webp"
                            alt="minus"
                            onClick={() => decrease(sushi._id)}
                          />

                          <span className="text-darkCharcoal font-bold font-cinzel">
                            {cartItems.find((i) => i._id === sushi._id)?.qty}
                          </span>

                          <img
                            className="cursor-pointer bg-deepGray p-1.5 rounded-full w-7 hover:bg-darkCharcoal transition-colors duration-300"
                            src="images/plus-icon.webp"
                            alt="add"
                            onClick={() => increase(sushi)}
                          />
                        </div>
                      ) : (
                        <img
                          className="absolute bottom-[1.375rem] right-[1.375rem] cursor-pointer bg-deepGray p-1.5 rounded-full w-7 hover:bg-darkCharcoal transition-colors duration-300"
                          src="images/plus-icon.webp"
                          alt="add"
                          onClick={() => increase(sushi)}
                        />
                      )}
                    </div>

                    <div className="p-4 lg:p-6 space-y-4">
                      <div className="space-y-3 ">
                        <h3 className="font-bold font-cinzel text-lg md:text-xl xl:text-2xl text-softBeigeYellow">
                          {sushi.title}
                        </h3>

                        <p className="text-lightGray lg:text-lg xl:text-xl">
                          {sushi.text}
                        </p>
                      </div>

                      <div className="flex justify-between items-center self-end">
                        <span className="font-bold font-cinzel text-xl md:text-base lg:text-xl text-softBeigeYellow">{`$${sushi.price} USD`}</span>
                        <img
                          src={`${import.meta.env.VITE_API_URL}${sushi.icon}`}
                          alt="stars"
                          className="w-24 lg:w-28"
                        />
                      </div>
                    </div>
                  </div>
                ))}

              {sushis.length > 6 && (
                <div className="col-span-full justify-center mt-6 lg:mt-10">
                  <button
                    className="text-xl text-softBeigeYellow underline hover:no-underline"
                    onClick={() =>
                      setVisibleCount(visibleCount === 6 ? sushis.length : 6)
                    }
                  >
                    {visibleCount === 6 ? "See More" : "See Less"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SpecialMenu;
