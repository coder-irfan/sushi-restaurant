import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <section
        id="contact"
        className="bg-footer-pattern bg-goldYellow bg-cover bg-no-repeat bg-center relative scroll-mt-10"
      >
        <div
          className="md:flex md:justify-center md:items-center px-4 sm:px-6 md:px-8 pt-20 pb-10
          lg:pt-28 lg:pb-16 lg:px-16 bg-gradient-to-t from-darkCharcoal to-transparent relative z-10"
        >
          <div className="text-center max-w-5xl mx-auto flex flex-col justify-center items-center space-y-4 md:space-y-6">
            <h2 className="font-bold font-cinzel text-2xl md:text-[clamp(1.5rem,5vw,3.5rem)] text-softBeigeYellow leading-[1.2]">
              We are ready to have you the best dining experiences
            </h2>

            <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-10">
              <div className="flex justify-center items-center gap-2">
                <img
                  src="images/map-pin-fill.webp"
                  alt="map"
                  className="w-6 h-6"
                />
                <p className="text-lightGray text-sm lg:text-lg">
                  1-2-3 Shibuya, Shibuya-ku, <br /> Tokyo, 150-0002, Japan
                </p>
              </div>
              <div className="flex justify-center items-center gap-2">
                <img
                  src="images/phone-fill.webp"
                  alt="phone"
                  className="w-6 h-6"
                />
                <p className="text-lightGray text-sm lg:text-lg">
                  Call us: +81 3-1234-5678
                </p>
              </div>
            </div>

            <Link to="/reservation">
              <div className="pt-6 md:pt-10">
                <button
                  className="text-darkCharcoal bg-goldYellow hover:bg-softBeigeYellow transition-colors duration-300 md:text-lg lg:text-xl py-2 px-3
                  md:py-3 md:px-6 font-cormorantSC font-semibold border border-darkCharcoal"
                >
                  Reserve A Table
                </button>
              </div>
            </Link>
            <div className="flex flex-col justify-center items-center gap-6 pt-8 md:pt-16">
              <img
                src="images/logo.webp"
                alt="logo"
                className="w-14 h-14 md:w-16 md:h-16"
              />
              <div className="font-cormorantSC font-semibold space-x-4">
                <ul className="flex items-center gap-2 md:gap-4">
                  <li>
                    <a
                      href="#"
                      className="hover-link text-lightGray lg:text-lg xl:text-xl"
                    >
                      Instagram
                    </a>
                  </li>
                  <li className="text-lightGray lg:text-lg xl:text-xl">|</li>
                  <li>
                    <a
                      href="#"
                      className="hover-link text-lightGray lg:text-lg xl:text-xl"
                    >
                      Twitter
                    </a>
                  </li>
                  <li className="text-lightGray lg:text-lg xl:text-xl">|</li>
                  <li>
                    <a
                      href="#"
                      className="hover-link text-lightGray lg:text-lg xl:text-xl"
                    >
                      Facebook
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute z-0 bottom-0 left-0 right-0 h-full bg-darkCharcoal bg-opacity-70" />
      </section>
    </>
  );
}

export default Footer;
