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

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(null);

  const [search, setSearch] = useState('');

  const [filters, setFilters] = useState({
    status: '',
    country: '',
    from: '',
    to: '',
    sort: '',
  });
  const [showFilter, setShowFilter] = useState(false);

  const [loadingOrders, setLoadingOrders] = useState(false);

  const { token } = useAdminAuth();

  const navigate = useNavigate();

  const fetchOrders = async (query = '', appliedFilters = filters) => {
    setLoadingOrders(true);
    try {
      const params = new URLSearchParams();

      if (query) params.append('q', query);
      if (appliedFilters.status) params.append('status', appliedFilters.status);
      if (appliedFilters.country)
        params.append('country', appliedFilters.country);
      if (appliedFilters.from) params.append('from', appliedFilters.from);
      if (appliedFilters.to) params.append('to', appliedFilters.to);
      if (appliedFilters.sort) params.append('sort', appliedFilters.sort);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/admin?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Server error!');
    } finally {
      setLoadingOrders(false);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchOrders, 400), [
    filters,
    token,
  ]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedFetch(value);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Function for updating statuses by Admin
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Order status updated!');
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status!');
    }
  };

  // Delete order
  const deleteOrder = async (id) => {
    try {
      setLoading(id);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders((prev) => prev.filter((order) => order._id !== id));
      toast.success('Order deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete sushi!');
      setLoading(null);
    } finally {
      setLoading(null);
    }
  };

  // Cancle pop-up notification
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const confirmCancel = (id) => {
    setIsConfirmOpen(true);
    toast.warning(
      <div className="flex flex-col gap-2">
        <p className="">Are you sure to delete this order?</p>

        <div className="flex items-center gap-2">
          <button
            className="border-2 border-green-400 hover:text-green-400 transition-colors duration-300 px-3 py-0.5 rounded-3xl"
            onClick={() => {
              deleteOrder(id);
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
                Orders
              </h2>

              <div className="flex items-center gap-4">
                <div className="relative w-full max-w-md">
                  <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search orders…"
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
                        disabled={loadingOrders}
                        className="w-full mb-3 bg-darkCharcoal text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-goldYellow transition"
                      >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <select
                        value={filters.sort}
                        onChange={(e) =>
                          setFilters((f) => ({ ...f, sort: e.target.value }))
                        }
                        disabled={loadingOrders}
                        className="w-full mb-3 bg-darkCharcoal text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-goldYellow transition"
                      >
                        <option value="">Sort by Price</option>
                        <option value="high">High → Low</option>
                        <option value="low">Low → High</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Country"
                        value={filters.country}
                        onChange={(e) =>
                          setFilters((f) => ({ ...f, country: e.target.value }))
                        }
                        disabled={loadingOrders}
                        className="w-full mb-3 bg-darkCharcoal text-white placeholder:text-lightGray text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-goldYellow transition"
                      />

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
                            disabled={loadingOrders}
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
                            disabled={loadingOrders}
                            className="flex-1 w-full bg-darkCharcoal text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-goldYellow transition"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between mt-4">
                        <button
                          className="bg-goldYellow text-black font-semibold rounded-lg px-4 py-2 hover:bg-softBeigeYellow transition"
                          onClick={() => {
                            fetchOrders(search, filters);
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
                              country: '',
                              from: '',
                              to: '',
                              sort: '',
                            });
                            fetchOrders(search, {
                              status: '',
                              country: '',
                              from: '',
                              to: '',
                              sort: '',
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

            {loadingOrders ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-softBeigeYellow"></div>
              </div>
            ) : orders.length === 0 ? (
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
                {orders.map((order, index) => {
                  return (
                    <motion.li
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-deepGray border border-lightGray rounded-lg p-4 md:p-6"
                      key={order._id}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 lg:gap-10">
                        <div className="sm:max-w-80 md:max-w-96 space-y-6">
                          <div className="flex gap-4 md:gap-6 items-center">
                            <div className="">
                              <img
                                src="/images/sushi-palate.webp"
                                alt="sushi palate"
                                className="w-24 md:w-28 lg:w-32"
                                width={128}
                                height={156}
                              />
                            </div>

                            <div className="flex flex-col gap-1 text-xs sm:text-sm md:text-base">
                              <span className="">
                                Order Id: #{order._id.slice(-6)}
                              </span>
                              <span className="">By: {order.fullname}</span>
                              <span className="truncate">
                                Date:{' '}
                                {new Date(order.createdAt).toLocaleString()}
                              </span>
                              <span className="">
                                Total Price:{' '}
                                <strong className="text-softBeigeYellow">
                                  ${order.totalAmount.toFixed(2)}
                                </strong>
                              </span>
                              <span className="">
                                items: {order.items.length}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm md:text-base !leading-relaxed">
                            {order.items.map((item, index) => {
                              if (index === order.items.length - 1) {
                                return item.title + ' ' + item.qty + 'x';
                              } else {
                                return item.title + ' ' + item.qty + 'x' + ', ';
                              }
                            })}
                            <span className="">
                              {' '}
                              -{' '}
                              <strong className="text-softBeigeYellow">
                                {order.country}, {order.city}
                              </strong>{' '}
                            </span>
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-2 md:gap-4 lg:gap-8 text-xs md:text-sm lg:text-base">
                          <button
                            disabled={isConfirmOpen || loading === order._id}
                            onClick={() =>
                              !isConfirmOpen && confirmCancel(order._id)
                            }
                            className={`flex items-center gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red/10 hover:bg-red/20 text-red transition-all duration-300
                            ${isConfirmOpen || loading ? 'cursor-not-allowed opacity-75' : ''}}`}
                          >
                            <FaTrash />
                            {loading === order._id ? 'Deleting...' : 'Delete'}
                          </button>

                          <button
                            disabled={isConfirmOpen}
                            onClick={() =>
                              navigate(`/admin/dashboard/orders/${order._id}`)
                            }
                            className={`flex items-center gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-softBeigeYellow/10 hover:bg-softBeigeYellow/20 text-softBeigeYellow transition-all 
                            duration-300 ${isConfirmOpen ? 'cursor-not-allowed' : ''}`}
                          >
                            <FiEye />
                            View More
                          </button>

                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            disabled={['cancelled', 'completed'].includes(
                              order.status
                            )}
                            className={`px-2 sm:px-3 py-1 md:py-2 rounded-md border bg-deepGray text-lightGray text-xs md:text-sm font-medium transition-colors duration-300  ${
                              order.status === 'pending'
                                ? 'text-softBeigeYellow'
                                : order.status === 'paid'
                                  ? 'text-blue-400'
                                  : order.status === 'shipped'
                                    ? 'text-indigo-400'
                                    : order.status === 'completed'
                                      ? 'text-green-400'
                                      : 'text-red'
                            } ${['cancelled', 'completed'].includes(order.status) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <option
                              value="pending"
                              className="text-softBeigeYellow"
                            >
                              pending
                            </option>
                            <option value="paid" className="text-blue-400">
                              paid
                            </option>
                            <option value="shipped" className="text-indigo-400">
                              shipped
                            </option>
                            <option
                              value="completed"
                              className="text-green-400"
                            >
                              completed
                            </option>
                            <option
                              value="cancelled"
                              disabled={['shipped', 'completed'].includes(
                                order.status
                              )}
                              className="text-red"
                            >
                              cancelled
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

export default Orders;
