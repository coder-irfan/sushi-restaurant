import React from "react";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes, FaShoppingCart, FaRegCalendarAlt, FaUser, FaSignOutAlt, FaStore } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

function Header({ scrolled, cartItems, isCartOpen, setIsCartOpen }) {

  // Openning and Closing Navbar
  const [isOpen, setIsOpen] = useState(false);

  // Cart
  const totalItems = cartItems.length;

  // Logged in users
  const { isAuthenticated, user, logout } = useAuth();
  
  // User icon dropdown
  const [isUserOpen, setIsUserOpen] = useState(false);
  const menuRef = useRef(null);

  // By clicking user icon it opens and closes the menu from it and outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="relative">
        <div className={`font-cormorantSC 2xl:max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 py-3 md:py-4 lg:px-16 fixed top-0 right-0 left-0 z-[60]
          transition-color duration-300 ${scrolled ? 'bg-darkCharcoal shadow-md shadow-darkCharcoal' : 'bg-transparent'}`}>
          <div className={`md:hidden fixed w-screen h-screen opacity-75 inset-0 bg-black transition-all duration-700 z-20
            ${isOpen ? 'translate-x-0 delay-100 pointer-events-auto' : 'translate-x-full delay-200 pointer-events-none'}`}>
          </div>

          <div className={`fixed w-screen h-screen inset-0 bg-black opacity-70 transition-all duration-700 z-[80]
            ${isCartOpen ? 'translate-x-0 delay-100 pointer-events-auto' : 'translate-x-full delay-200 pointer-events-none'}`}>
          </div>

          <div className="flex md:items-center justify-between">
            <div className="">
              <img src="images/logo.webp" alt="logo" className="w-14 h-14 lg:w-16 lg:h-16" />
            </div>

            <div className="z-50">
              <nav className={`md:relative fixed top-0 right-0 h-full w-2/3 sm:w-2/4 md:right-0 transition-all duration-700 pt-24 pr-6 md:pr-0 md:pt-0
                bg-gradient-to-t from-darkCharcoal to-deepGray md:from-transparent md:to-transparent md:h-auto md:w-auto md:translate-x-0 
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col md:flex-row items-end gap-10">
                  <ul className="flex flex-col md:flex-row items-end md:items-center gap-4 lg:gap-6 xl:gap-8 text-lg xl:text-xl text-white">
                    <li className="hover-link"><a href="#home" className="">Home</a></li>
                    <li className="hover-link"><a href="#menu" className="">Menu</a></li>
                    <li className="hover-link"><a href="#dining" className="">Fine Dining</a></li>
                    <li className="hover-link"><a href="#story" className="">Story</a></li>
                    <li className="hover-link"><a href="#contact" className="">Contact</a></li>
                  </ul>

                  <Link to="/reservation">
                    <button className="flex md:hidden uppercase text-goldYellow border-2 border-goldYellow px-3 py-1 shadow-[0_0_0.3rem] lg:text-lg xl:text-xl hover:text-softBeigeYellow
                    hover:border-softBeigeYellow transition-colors duration-300 font-semibold items-center gap-2">
                      <FaRegCalendarAlt />
                      Reservation -----
                    </button>
                  </Link>
                  
                </div>

                {isOpen && (
                  <div className="absolute top-7 right-5 sm:right-6 text-2xl md:hidden" onClick={() => setIsOpen(false)}>
                    <FaTimes aria-label="Close menu" className="text-goldYellow cursor-pointer"/>
                  </div>
                )}
              </nav>
            </div>

            <div className={`flex items-center justify-center gap-4 lg:gap-6
                ${isAuthenticated && user 
                  ? ""
                  : "mr-10 md:mr-0"
                }
              `}>
              <div className="relative">
                <FaShoppingCart 
                  onClick={() => setIsCartOpen(true)}
                  className="w-6 h-6 md:w-7 md:h-7 text-goldYellow cursor-pointer hover:text-softBeigeYellow transition-colors duration-300"
                />
                <span className="absolute -top-3 -right-3 md:-right-2 lg:-right-3 bg-goldYellow rounded-full font-cinzel font-extrabold text-darkCharcoal text-xs px-1.5 pt-1 pb-0.5">
                  {totalItems}
                </span>
              </div>

              {isAuthenticated && user 
                ? 
                  <>
                    <div 
                      className="font-cinzel"
                      ref={menuRef}
                    >
                      <FaUser 
                        onClick={() => setIsUserOpen((prev) => !prev )}
                        className="w-5 h-5 md:w-7 md:h-7 text-goldYellow cursor-pointer hover:text-softBeigeYellow transition-colors duration-300 mr-10 md:mr-0"
                      />

                      {isUserOpen  && (
                        <div className="absolute right-10 mt-6  bg-deepGray shadow-xl shadow-darkCharcoal rounded-lg z-10">
                          <Link to="/myorder">
                            <button className="flex items-center gap-6 p-4 hover:text-softBeigeYellow transition-colors duration-300">
                              My orders
                              <FaStore className="" />
                            </button>
                          </Link>

                          <hr />

                          <Link to="/mybooking">
                            <button className="flex items-center gap-6 p-4 hover:text-softBeigeYellow transition-colors duration-300">
                              My booking 
                              <FaRegCalendarAlt className="" />
                            </button>
                          </Link>

                          <hr />

                          <button className="flex items-center gap-6 p-4 hover:text-softBeigeYellow transition-colors duration-300" onClick={logout}>
                            Log out
                            <FaSignOutAlt className="" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                  </>
                : <Link to="/reservation">
                    <button className="hidden md:flex uppercase text-goldYellow border-2 border-goldYellow px-3 py-1 shadow-[0_0_0.3rem] lg:text-lg xl:text-xl hover:text-softBeigeYellow
                    hover:border-softBeigeYellow transition-colors duration-300 font-semibold items-center gap-2">
                      <FaRegCalendarAlt />
                      Reservation -----
                    </button>
                  </Link>
              }
              
            </div>
            
            {!isOpen && (
              <div className="absolute top-7 right-5 sm:right-6 text-2xl md:hidden" onClick={() => setIsOpen(true)}>
                <FaBars aria-label="Open menu" className="text-goldYellow cursor-pointer" />
              </div>
            )}

          </div>
        </div>
      </header>
    </>
  )
}

export default Header;