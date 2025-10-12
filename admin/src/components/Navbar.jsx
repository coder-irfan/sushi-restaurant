import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCogs, FaSignOutAlt } from 'react-icons/fa';
import { useAdminAuth } from '../context/AdminAuthContext';

function Navbar() {
  const [isUserOpen, setIsUserOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <>
      <section className="flex justify-between items-center 2xl:max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 py-3 md:py-4 lg:px-16">
        <img
          src="/images/logo.webp"
          alt="logo"
          className="w-14 h-14 lg:w-16 lg:h-16"
        />

        <div className="" ref={menuRef}>
          <img
            src="/images/user-icon.png"
            alt="user-icon"
            className="w-9 h-9 md:w-10 md:h-10 cursor-pointer hover:brightness-125 transition-all duration-300"
            onClick={() => setIsUserOpen((prev) => !prev)}
          />

          {isUserOpen && (
            <div className="font-cinzel absolute right-4 sm:right-6 md:right-10 mt-4 bg-deepGray shadow-xl shadow-darkCharcoal rounded-lg z-10 text-xs md:text-sm font-semibold">
              <Link to="/admin/dashboard/settings">
                <button className="flex items-center gap-4 p-4 hover:text-softBeigeYellow transition-colors duration-300">
                  Settings
                  <FaCogs />
                </button>
              </Link>

              <hr />

              <button
                className="flex items-center gap-4 p-4 hover:text-softBeigeYellow transition-colors duration-300"
                onClick={handleLogout}
              >
                Log out
                <FaSignOutAlt />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Navbar;
