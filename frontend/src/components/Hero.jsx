import React from "react";
import { Link } from "react-router-dom";
import {
  FaUserPlus,
  FaSignInAlt,
  FaStore,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

function Hero() {
  const { user, isAuthenticated } = useAuth();

  return (
    <>
      <section
        id="home"
        className="md:flex md:justify-center md:items-center px-4 sm:px-6 md:px-8 pt-36 pb-24 sm:pt-36
        md:pt-44 md:pb-20 xl:pt-56 xl:pb-28 lg:px-16 bg-gradient-to-t from-darkCharcoal to-transparent relative z-10"
      >
        <div className="text-center max-w-3xl lg:max-w-[53.125rem] space-y-10 md:space-y-16">
          <div className="space-y-4">
            <span className="font-greatVibes text-lg md:text-xl lg:text-2xl text-white tracking-[0.2rem] md:tracking-[0.5rem]">
              Best Sushi In Town
            </span>

            <h1 className="font-bold font-cinzel text-2xl md:text-[clamp(1.5rem,5vw,4rem)] text-softBeigeYellow leading-[1.2]">
              {isAuthenticated && user
                ? `Welcome, ${user.fullname}`
                : "Taste the rich flavor of high quality sushi"}
            </h1>

            <p className="text-lightGray md:text-lg lg:text-xl max-w-[25rem] mx-auto">
              We only use the five star quality for our menu, come and get the
              richness in every food we serve.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link to={isAuthenticated && user ? "/myorder" : "/signup"}>
              <button
                className="bg-goldYellow uppercase shadow-[0_0_0.2rem] shadow-goldYellow text-darkCharcoal font-cormorantSC font-semibold px-4 py-2 lg:text-lg
                xl:text-xl hover:bg-softBeigeYellow hover:shadow-softBeigeYellow transition-color duration-300 flex items-center gap-2"
              >
                {isAuthenticated && user ? <FaStore /> : <FaUserPlus />}

                {isAuthenticated && user ? "My orders -----" : "Sign Up -----"}
              </button>
            </Link>

            <Link to={isAuthenticated && user ? "/mybooking" : "/login"}>
              <button
                className="uppercase font-cormorantSC text-goldYellow border-2 border-goldYellow px-3 py-1.5 shadow-[0_0_0.3rem] lg:text-lg xl:text-xl hover:text-softBeigeYellow
              hover:border-softBeigeYellow transition-colors duration-300 font-semibold flex items-center gap-3"
              >
                {isAuthenticated && user ? (
                  <FaRegCalendarAlt />
                ) : (
                  <FaSignInAlt />
                )}

                {isAuthenticated && user ? "My booking -----" : "Log In -----"}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
