import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAdminAuth } from '../context/AdminAuthContext';
import { motion } from 'framer-motion';
import { debounce } from 'lodash'; // is used for delaying
import {
  FaArrowLeft,
  FaTrash,
  FaPencilAlt,
  FaSearch,
  FaTimesCircle,
} from 'react-icons/fa';

function ManageSushis() {
  const [sushis, setSushis] = useState([]);
  const [loading, setLoading] = useState(null);

  const [search, setSearch] = useState('');

  const { token } = useAdminAuth();

  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchSushis = async (query = '') => {
    try {
      setLoadingOrders(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/sushi?q=${query}`, // Sends the user’s search input to the backend so only matching sushis are returned.
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSushis(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Server error!');
    } finally {
      setLoadingOrders(false);
    }
  };

  // Debounced version to avoid flooting API
  const debouncedFetch = useCallback(debounce(fetchSushis, 400), []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedFetch(value);
  };

  useEffect(() => {
    fetchSushis();
  }, []);

  // Delete sushi based on id
  const deleteSushi = async (id) => {
    try {
      setLoading(id);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/sushi/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove deleted sushi from state to update UI
      setSushis((prev) => prev.filter((sushi) => sushi._id !== id));

      toast.success('Sushi deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete sushi!');
      setLoading(null);
    } finally {
      setLoading(null);
    }
  };

  // Cancel pop-up confirmation
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const confirmCancel = (id) => {
    setIsConfirmOpen(true);
    toast.warning(
      <div className="flex flex-col gap-2">
        <p className="">Are you sure to delete this sushi?</p>

        <div className="flex items-center gap-2">
          <button
            className="border-2 border-green-400 hover:text-green-400 transition-colors duration-300 px-3 py-0.5 rounded-3xl"
            onClick={() => {
              deleteSushi(id);
              toast.dismiss();
              setIsConfirmOpen(false);
            }}
          >
            Yes
          </button>

          <button
            className="border-2 border-red hover:text-red transition-colors duration-300 px-3 py-0.5 rounded-3xl"
            onClick={() => {
              toast.dismiss();
              setIsConfirmOpen(false);
            }}
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeButton: false, closeOnClick: false }
    );
  };

  return (
    <>
      <section className="max-w-6xl mx-auto pt-6 md:pt-10 pb-20 px-4 md:px-10 xl:px-0">
        <div className="space-y-6 sm:space-y-10">
          <Link to="/admin/dashboard">
            <span className="my-2 text-lightGray font-cinzel hover:underline flex justify-start items-center gap-2 hover:text-goldYellow transition-colors duration-300">
              <FaArrowLeft className="w-3" />
              Back
            </span>
          </Link>

          <div className="space-y-6 sm:space-y-10 xl:space-y-14">
            <div className="flex flex-col gap-6 md:flex-row justify-between items-center">
              <h2 className="text-lightGray font-medium text-2xl lg:text-3xl xl:text-[2.5rem]">
                Manage Sushis
              </h2>

              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search by title or description..."
                  className="w-full py-2 pl-4 pr-8 md:pl-6 md:pr-12 md:py-3 rounded-full border border-lightGray bg-deepGray text-lightGray focus:outline-none
                  text-sm md:text-base focus:border-softBeigeYellow"
                />

                <FaSearch className="absolute right-4 md:right-5 top-1/2 transform -translate-y-1/2 text-softBeigeYellow text-sm md:text-base" />
              </div>
            </div>

            {loadingOrders ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-softBeigeYellow"></div>
              </div>
            ) : sushis.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-20 px-4 gap-2 md:gap-4 pt-10">
                <div className="space-y-10 lg:space-y-16 flex flex-col items-center">
                  <div
                    className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full bg-deepGray border border-red 
                    shadow-[0_0_0.5rem] shadow-red animate-ping"
                  >
                    <FaTimesCircle className="text-lg md:text-2xl lg:text-3xl text-red" />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-semibold text-lightGray text-center">
                    No sushis found!
                  </h3>
                </div>

                <p className="text-center text-gray-400 max-w-xs md:max-w-md">
                  Oops! We couldn’t find any sushi.
                </p>

                <Link
                  to="/admin/dashboard/add-sushi"
                  className="mt-4 px-6 py-2 rounded-full bg-goldYellow text-darkCharcoal font-medium hover:bg-softBeigeYellow transition-all duration-300 shadow-md"
                >
                  Add New Sushi
                </Link>
              </div>
            ) : (
              <ul className="space-y-10">
                {sushis.map((sushi, index) => {
                  return (
                    <motion.li
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-deepGray border border-lightGray rounded-lg p-4 md:p-6"
                      key={sushi._id}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 lg:gap-10">
                        <div className="sm:max-w-80 md:max-w-96 space-y-6">
                          <div className="flex gap-4 md:gap-6 items-center">
                            <div className="">
                              <img
                                src={`${import.meta.env.VITE_API_URL}${sushi.img}`}
                                alt={sushi.name}
                                className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-cover rounded-lg border border-softBeigeYellow"
                                width={128}
                                height={156}
                              />
                            </div>

                            <div className="flex flex-col gap-1 text-xs sm:text-sm md:text-base">
                              <h3 className="truncate">Title: {sushi.title}</h3>
                              <span className="">
                                Price:{' '}
                                <strong className="text-softBeigeYellow">
                                  ${sushi.price.toFixed(2)}
                                </strong>
                              </span>
                              <span className="flex items-center gap-2">
                                Rating:{' '}
                                <img
                                  src={`${import.meta.env.VITE_API_URL}${sushi.icon}`}
                                  alt="star icon"
                                  className="w-16 sm:w-20 lg:w-24"
                                />
                              </span>
                            </div>
                          </div>

                          <p className="text-sm md:text-base !leading-relaxed">
                            <span className="text-softBeigeYellow truncate">
                              Description:{' '}
                            </span>{' '}
                            {sushi.text}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 md:gap-4 lg:gap-8 text-xs md:text-sm lg:text-base">
                          <Link to={`/admin/dashboard/add-sushi/${sushi._id}`}>
                            <button
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-softBeigeYellow/10 hover:bg-softBeigeYellow/20 text-softBeigeYellow transition-all duration-300
                              ${isConfirmOpen ? 'cursor-not-allowed' : ''}`}
                              disabled={isConfirmOpen}
                            >
                              <FaPencilAlt />
                              Edit
                            </button>
                          </Link>

                          <button
                            disabled={isConfirmOpen || loading === sushi._id}
                            onClick={() =>
                              !isConfirmOpen && confirmCancel(sushi._id)
                            }
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-red/10 hover:bg-red/20 text-red transition-all duration-300
                            ${isConfirmOpen || loading ? 'cursor-not-allowed opacity-75' : ''}}`}
                          >
                            <FaTrash />
                            {loading === sushi._id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default ManageSushis;
