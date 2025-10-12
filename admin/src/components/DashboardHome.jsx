import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineShoppingCart } from 'react-icons/md';
import {
  FaPlusCircle,
  FaUtensils,
  FaRegCalendarCheck,
  FaUsers,
  FaArrowRight,
  FaHistory,
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

function DashboardHome() {
  const [stats, setStasts] = useState({
    sushis: 0,
    orders: 0,
    reservations: 0,
    users: 0,
    activity: 0,
  });

  const token = sessionStorage.getItem('adminToken');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStasts(res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error fetching stats!');
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Add Sushi', icon: <FaPlusCircle />, link: 'add-sushi' },
    { title: 'Manage Sushis', icon: <FaUtensils />, link: 'manage-sushis' },
    { title: 'Orders', icon: <MdOutlineShoppingCart />, link: 'orders' },
    {
      title: 'Reservations',
      icon: <FaRegCalendarCheck />,
      link: 'reservations',
    },
    { title: 'Users', icon: <FaUsers />, link: 'users' },
    { title: 'Activity', icon: <FaHistory />, link: 'activity' },
  ];

  return (
    <>
      <section className="2xl:max-w-[100rem] mx-auto px-4 py-10 sm:px-6 md:px-8 md:py-4 lg:p-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center gap-y-8 sm:gap-y-4 sm:gap-x-6 justify-between">
          {cards.map((card, idx) => (
            <div
              className={`flex min-h-48 lg:min-h-60 bg-deepGray border-l-[0.4rem] border-l-goldYellow w-full p-4 md:p-6 shadow-md shadow-darkCharcoal
              text-white rounded-l-lg`}
              key={idx}
            >
              <div className="flex flex-col justify-between">
                <div className="space-y-4">
                  <h2 className="flex items-center gap-2 text-lg md:text-xl">
                    <span className="text-lg md:text-xl">{card.icon}</span>
                    {card.title}
                  </h2>

                  <p className="text-lightGray text-sm lg:text-base">
                    {card.title === 'Manage Sushis'
                      ? `Total sushis: ${stats.sushis}`
                      : card.title === 'Orders'
                        ? `Total orders: ${stats.orders}`
                        : card.title === 'Reservations'
                          ? `Total reservations: ${stats.reservations}`
                          : card.title === 'Users'
                            ? `Total registerations: ${stats.users}`
                            : card.title === 'Activity'
                              ? `Total activities: ${stats.activity}`
                              : ''}
                  </p>
                </div>

                <div className="">
                  <Link to={card.link}>
                    <button
                      className="flex items-center gap-4 border border-goldYellow px-4 py-1.5 rounded-full group relative hover:text-goldYellow
                      transition-colors duration-300 text-sm lg:text-base"
                    >
                      See more
                      <FaArrowRight className="translate-x-[-5px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default DashboardHome;
