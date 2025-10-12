import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../context/AdminAuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Activity() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const { token } = useAdminAuth();

  const [page, setPage] = useState(1); // Current page
  const limit = 20; // How many logs per page

  const fetchActivity = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/activity?page=${currentPage}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setActivity(res.data.logs);
      setTotal(res.data.total);
      setPage(currentPage);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to fetch activities!'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity(page);
  }, []);

  const totalPages = Math.ceil(total / limit);

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
              Activity <span className="text-2xl">({total})</span>
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-40">
                <div className="animate-spin rounded-full w-12 h-12 border-t-4 border-b-4 border-softBeigeYellow"></div>
              </div>
            ) : activity.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-20 px-4 gap-2 md:gap-4 pt-10">
                <div className="space-y-10 lg:space-y-16 flex flex-col items-center">
                  <div
                    className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full bg-deepGray border border-red 
                    shadow-[0_0_0.5rem] shadow-red animate-ping"
                  >
                    <FaTimesCircle className="text-lg md:text-2xl lg:text-3xl text-red" />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-semibold text-lightGray text-center">
                    No activity found!
                  </h3>
                </div>

                <p className="text-center text-gray-400 max-w-xs md:max-w-md">
                  Oops! We couldn’t find any activities.
                </p>
              </div>
            ) : (
              <>
                <ul className="space-y-10">
                  {activity.map((log, index) => (
                    <motion.li
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-deepGray border border-lightGray rounded-lg p-4 md:p-6 space-y-3"
                      key={log._id}
                    >
                      <div className="">
                        <p className="text-lightGray text-sm md:text-base">
                          <span className="text-softBeigeYellow font-medium ">
                            {log.userId?.fullname || 'Unknown User'}
                          </span>{' '}
                          - {log.action}
                        </p>

                        <p className="text-xs md:text-sm text-gray-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>

                      {log.details && (
                        <pre className="bg-darkCharcoal p-4 rounded-lg text-xs text-gray-200 text-wrap">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                    </motion.li>
                  ))}
                </ul>

                <div className="flex justify-center items-center gap-4 mt-6">
                  <button
                    className="px-4 py-2 rounded bg-softBeigeYellow text-black font-semibold hover:bg-goldYellow disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={page <= 1}
                    onClick={() => fetchActivity(page - 1)}
                  >
                    Previous
                  </button>

                  <span className="">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    className="px-4 py-2 rounded bg-softBeigeYellow text-black font-semibold hover:bg-goldYellow disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={page >= totalPages}
                    onClick={() => fetchActivity(page + 1)}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Activity;
