import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaTimesCircle,
  FaTrash,
} from 'react-icons/fa';
import { FiEye } from 'react-icons/fi';
import { debounce } from 'lodash';
import { motion } from 'framer-motion';
import { useAdminAuth } from '../context/AdminAuthContext';

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(null);

  const [search, setSearch] = useState('');

  const [filters, setFilters] = useState({
    status: '',
    people: '',
    table: '',
    from: '',
    to: '',
  });
  const [showFilter, setShowFilter] = useState(false);

  const [loadingReservations, setLoadingReservations] = useState(false);

  const { token } = useAdminAuth();

  const navigate = useNavigate();

  const fetchReservation = async (query = '', appliedFilters = filters) => {
    setLoadingReservations(true);
    try {
      const params = new URLSearchParams();

      if (query) params.append('q', query);
      if (appliedFilters.status) params.append('status', appliedFilters.status);
      if (appliedFilters.people) params.append('people', appliedFilters.people);
      if (appliedFilters.table) params.append('table', appliedFilters.table);
      if (appliedFilters.from) params.append('from', appliedFilters.from);
      if (appliedFilters.to) params.append('to', appliedFilters.to);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reservation/admin?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReservations(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Could not fetch reservations!'
      );
    } finally {
      setLoadingReservations(false);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchReservation, 400), [
    filters,
    token,
  ]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedFetch(value);
  };

  useEffect(() => {
    fetchReservation();
  }, []);

  // Function for updating status by admin
  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/reservation/${reservationId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Status updated successfully!');
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation._id === reservationId
            ? { ...reservation, status: newStatus }
            : reservation
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status!');
    }
  };

  // Delete reservation
  const deleteReservation = async (id) => {
    try {
      setLoading(id);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/reservation/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReservations((prev) =>
        prev.filter((reservation) => reservation._id !== id)
      );
      toast.success('Reservation deleted successfully!');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to delete reservation!'
      );
      setLoading(null);
    } finally {
      setLoading(null);
    }
  };

  // Cancel pop-up notification
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const confirmCancel = (id) => {
    setIsConfirmOpen(true);
    toast.warning(
      <div className="flex flex-col gap-2">
        <p className="">Are you sure to delete this reservation?</p>

        <div className="flex items-center gap-2">
          <button
            className="border-2 border-green-400 hover:text-green-400 transition-colors duration-300 px-3 py-0.5 rounded-3xl"
            onClick={() => {
              deleteReservation(id);
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
                Reservations
              </h2>

              <div className="flex items-center gap-4">
                <div className="relative w-full max-w-md">
                  <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search reservations..."
                    className="w-full py-2 pl-4 pr-8 md:pl-6 md:pr-12 md:py-3 rounded-full border border-lightGray bg-deepGray text-lightGray focus:outline-none
                    text-sm md:text-base focus:border-softBeigeYellow"
                  />

                  <FaSearch className="absolute right-4 md:right-5 top-1/2 transform -translate-y-1/2 text-softBeigeYellow text-sm md:text-base" />
                </div>
                <div className="relative">
                  <FaFilter
                    className="md:text-lg xl:text-2xl text-lightGray hover:text-softBeigeYellow transition-colors duration-300 cursor-pointer"
                    onClick={() => setShowFilter((prev) => !prev)}
                  />

                  {showFilter && (
                    <div className="absolute right-0 mt-3 w-72 bg-deepGray border border-lightGray shadow-[0_0_3rem] shadow-black rounded-2xl p-4 md:p-5 z-50 animate-fadeIn">
                      <select
                        value={filters.status}
                        onChange={(e) =>
                          setFilters((f) => ({ ...f, status: e.target.value }))
                        }
                        disabled={loadingReservations}
                        className="w-full mb-3 bg-darkCharcoal text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-goldYellow transition"
                      >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no-show">No-Show</option>
                      </select>

                      <select
                        value={filters.table}
                        onChange={(e) =>
                          setFilters((f) => ({ ...f, table: e.target.value }))
                        }
                        disabled={loadingReservations}
                        className="w-full mb-3 bg-darkCharcoal text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-goldYellow transition"
                      >
                        <option value="">Sort by table</option>
                        <option value="Fine | $500">Fine | $500</option>
                        <option value="Gold | $1000">Gold | $1000</option>
                        <option value="Royalty | $1500">Royalty | $1500</option>
                      </select>

                      <select
                        onChange={(e) =>
                          setFilters((f) => ({ ...f, people: e.target.value }))
                        }
                        disabled={loadingReservations}
                        className="w-full mb-3 bg-darkCharcoal text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-goldYellow transition"
                      >
                        <option value="">Sort by People</option>
                        <option value="high">High → Low</option>
                        <option value="low">Low → High</option>
                      </select>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor="from"
                            className="text-xs md:text-sm text-softBeigeYellow"
                          >
                            From
                          </label>
                          <input
                            id="from"
                            type="date"
                            value={filters.from}
                            onChange={(e) =>
                              setFilters((f) => ({
                                ...f,
                                from: e.target.value,
                              }))
                            }
                            disabled={loadingReservations}
                            className="flex-1 w-full bg-darkCharcoal text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-goldYellow transition"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <label
                            htmlFor="to"
                            className="text-xs md:text-sm text-softBeigeYellow"
                          >
                            To
                          </label>
                          <input
                            id="to"
                            type="date"
                            value={filters.to}
                            onChange={(e) =>
                              setFilters((f) => ({ ...f, to: e.target.value }))
                            }
                            disabled={loadingReservations}
                            className="flex-1 w-full bg-darkCharcoal text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-goldYellow transition"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between mt-4">
                        <button
                          className="bg-goldYellow text-black font-semibold rounded-lg px-4 py-2 hover:bg-softBeigeYellow transition"
                          onClick={() => {
                            fetchReservation(search, filters);
                            setShowFilter(false);
                          }}
                        >
                          Apply
                        </button>

                        <button
                          className="border border-lightGray text-lightGray rounded-lg px-4 py-2 hover:border-goldYellow hover:text-goldYellow transition"
                          onClick={() => {
                            setFilters({
                              status: '',
                              table: '',
                              people: '',
                              from: '',
                              to: '',
                            });

                            fetchReservation(search, {
                              status: '',
                              table: '',
                              people: '',
                              from: '',
                              to: '',
                            });
                          }}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {loadingReservations ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-softBeigeYellow"></div>
              </div>
            ) : reservations.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-20 px-4 gap-2 md:gap-4 pt-10">
                <div className="space-y-10 lg:space-y-16 flex flex-col items-center">
                  <div
                    className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full bg-deepGray border border-red 
                    shadow-[0_0_0.5rem] shadow-red animate-ping"
                  >
                    <FaTimesCircle className="text-lg md:text-2xl lg:text-3xl text-red" />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-semibold text-lightGray text-center">
                    No orders found!
                  </h3>
                </div>

                <p className="text-center text-gray-400 max-w-xs md:max-w-md">
                  Oops! We couldn’t find any orders.
                </p>
              </div>
            ) : (
              <ul className="space-y-10">
                {reservations.map((reservation, index) => {
                  return (
                    <motion.li
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-deepGray border border-lightGray rounded-lg p-4 md:p-6"
                      key={reservation._id}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 lg:gap-10">
                        <div className="sm:max-w-80 md:max-w-96 space-y-6">
                          <div className="flex gap-4 md:gap-6 items-center">
                            {reservation.table === 'Fine | $500' ? (
                              <img
                                src="/images/fine-chair.webp"
                                alt="fine chair"
                                className="w-24 md:w-28 lg:w-32"
                                width={128}
                                height={156}
                              />
                            ) : reservation.table === 'Gold | $1000' ? (
                              <img
                                src="/images/golden-chair.webp"
                                alt="golden chair"
                                className="w-24 md:w-28 lg:w-32"
                                width={128}
                                height={156}
                              />
                            ) : reservation.table === 'Royalty | $1500' ? (
                              <img
                                src="/images/luxury-chair.webp"
                                alt="luxury chair"
                                className="w-24 md:w-28 lg:w-32"
                                width={128}
                                height={156}
                              />
                            ) : (
                              ''
                            )}

                            <div className="flex flex-col gap-1 text-xs sm:text-sm md:text-base">
                              <span className="">
                                Reservation ID: #{reservation._id.slice(-6)}
                              </span>
                              <span className="">
                                By: {reservation.fullname}
                              </span>
                              <span className="">
                                Table:{' '}
                                <strong className="text-softBeigeYellow">
                                  {reservation.table}
                                </strong>
                              </span>
                              <span className="">
                                Date:{' '}
                                {new Date(reservation.date).toLocaleDateString(
                                  'en-US',
                                  {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  }
                                )}
                              </span>
                              <span className="">
                                Time:{' '}
                                {new Date(
                                  `1970-01-01T${reservation.time}`
                                ).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true,
                                })}
                              </span>
                              <span className="">
                                People: {reservation.people}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm md:text-base !leading-relaxed">
                            Comments:{' '}
                            {reservation.comments
                              ? reservation.comments
                              : 'No comments provided'}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-2 md:gap-4 lg:gap-8 text-xs md:text-sm lg:text-base">
                          <button
                            disabled={
                              isConfirmOpen || loading === reservation._id
                            }
                            onClick={() =>
                              !isConfirmOpen && confirmCancel(reservation._id)
                            }
                            className={`flex items-center gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red/10 hover:bg-red/20 text-red transition-all duration-300
                            ${isConfirmOpen || loading ? 'cursor-not-allowed opacity-75' : ''}}`}
                          >
                            <FaTrash />
                            {loading === reservation._id
                              ? 'Deleting...'
                              : 'Delete'}
                          </button>

                          <button
                            disabled={isConfirmOpen}
                            onClick={() =>
                              navigate(
                                `/admin/dashboard/reservations/${reservation._id}`
                              )
                            }
                            className={`flex items-center gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-softBeigeYellow/10 hover:bg-softBeigeYellow/20 text-softBeigeYellow transition-all 
                                                        duration-300 ${isConfirmOpen ? 'cursor-not-allowed' : ''}`}
                          >
                            <FiEye />
                            View More
                          </button>

                          <select
                            value={reservation.status}
                            onChange={(e) => {
                              handleStatusChange(
                                reservation._id,
                                e.target.value
                              );
                            }}
                            disabled={['cancelled', 'completed'].includes(
                              reservation.status
                            )}
                            className={`px-2 sm:px-3 py-1 md:py-2 rounded-md border bg-deepGray text-lightGray text-xs md:text-sm font-medium transition-colors duration-300  ${
                              reservation.status === 'pending'
                                ? 'text-softBeigeYellow'
                                : reservation.status === 'confirmed'
                                  ? 'text-blue-400'
                                  : reservation.status === 'completed'
                                    ? 'text-green-400'
                                    : reservation.status === 'cancelled'
                                      ? 'text-red'
                                      : 'text-gray-400'
                            } ${['cancelled', 'completed'].includes(reservation.status) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <option
                              value="pending"
                              className="text-softBeigeYellow"
                            >
                              Pending
                            </option>
                            <option value="confirmed" className="text-blue-400">
                              Confirmed
                            </option>
                            <option
                              value="completed"
                              className="text-green-400"
                            >
                              Completed
                            </option>
                            <option
                              value="cancelled"
                              disabled={['no-show', 'completed'].includes(
                                reservation.status
                              )}
                              className="text-red"
                            >
                              Cancelled
                            </option>

                            <option
                              value="no-show"
                              disabled={['cancelled', 'completed'].includes(
                                reservation.status
                              )}
                              className="text-gray-400"
                            >
                              No-Show
                            </option>
                          </select>
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

export default Reservations;
