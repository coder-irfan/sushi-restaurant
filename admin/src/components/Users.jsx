import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaTimesCircle, FaUser, FaTrash } from 'react-icons/fa';
import { useAdminAuth } from '../context/AdminAuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(null);
  const { token } = useAdminAuth();
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch users!');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    try {
      setLoading(id);
      axios.delete(`${import.meta.env.VITE_API_URL}/api/auth/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers((prev) => prev.filter((user) => user._id !== id));
      toast.success('User deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Server error!');
      setLoading(null);
    } finally {
      setLoading(null);
    }
  };

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const confirmCancel = (id) => {
    setIsConfirmOpen(true);
    toast.warning(
      <div className="flex flex-col gap-2">
        <p className="">Are you sure to delete this user?</p>

        <div className="flex items-center gap-2">
          <button
            className="border-2 border-green-400 hover:text-green-400 transition-colors duration-300 px-3 py-0.5 rounded-3xl"
            onClick={() => {
              deleteUser(id);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
            <h2 className="text-lightGray font-medium text-2xl lg:text-3xl xl:text-[2.5rem]">
              Users
            </h2>

            {loadingUsers ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-softBeigeYellow"></div>
              </div>
            ) : users.length === 0 ? (
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
                {users.map((user, index) => {
                  return (
                    <motion.li
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-deepGray border border-lightGray rounded-lg p-4 md:p-6"
                      key={user._id}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 lg:gap-10">
                        <div className="">
                          <div className="flex gap-4 md:gap-6 items-center">
                            <div className="flex-shrink-0 w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-lightGray flex items-center justify-center text-deepGray text-lg md:text-2xl">
                              <FaUser className="text-3xl md:text-4xl lg:text-5xl" />
                            </div>

                            <div className="flex flex-col gap-1 text-xs sm:text-sm md:text-base">
                              <span className="">
                                User ID: #{user._id.slice(-6)}
                              </span>
                              <span className="">
                                Name:{' '}
                                <span className="text-softBeigeYellow">
                                  {user.fullname}
                                </span>
                              </span>
                              <span className="">Email: {user.email}</span>
                              <span className="">
                                Joined:{' '}
                                <span className="text-softBeigeYellow">
                                  {formatDate(user.createdAt)}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-end text-xs md:text-sm lg:text-base">
                          <button
                            disabled={isConfirmOpen || loading === user._id}
                            onClick={() =>
                              !isConfirmOpen && confirmCancel(user._id)
                            }
                            className={`flex items-center gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red/10 hover:bg-red/20 text-red transition-all duration-300
                            ${isConfirmOpen || loading ? 'cursor-not-allowed opacity-60' : ''}}`}
                          >
                            <FaTrash />
                            {loading === user._id ? 'Deleting...' : 'Delete'}
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

export default Users;
