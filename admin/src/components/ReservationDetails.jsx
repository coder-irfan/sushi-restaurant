import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  FaArrowLeft,
  FaTimesCircle,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaChair,
  FaUsers,
  FaCommentDots,
  FaEnvelope,
  FaInfoCircle,
} from 'react-icons/fa';

function ReservationDetails() {
  const [reservation, setReservation] = useState(null);
  const { id } = useParams();
  const { token } = useAdminAuth();

  const [loadingReservation, setLoadingReservation] = useState(false);

  useEffect(() => {
    const fetchReservation = async () => {
      setLoadingReservation(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/reservation/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReservation(res.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Failed to fetch reservation!'
        );
      } finally {
        setLoadingReservation(false);
      }
    };
    fetchReservation();
  }, [id, token]);

  const formDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formattedDate = new Date(
    `1970-01-01T${reservation.time}`
  ).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const statusColor = {
    pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30',
    confirmed: 'bg-green-500/20 text-green-400 border border-green-400/30',
    completed: 'bg-blue-500/20 text-blue-400 border border-blue-400/30',
    cancelled: 'bg-red-500/20 text-red-400 border border-red-400/30',
    'no-show': 'bg-gray-500/20 text-gray-400 border border-gray-400/30',
  };

  return (
    <>
      <section className="max-w-6xl mx-auto pt-4 md:pt-10 py-20 px-4 md:px-10 xl:px-0">
        <div className="space-y-6 sm:space-y-10">
          <Link to="/admin/dashboard/reservations">
            <span className="my-2 text-lightGray font-cinzel hover:underline flex justify-start items-center gap-2 hover:text-goldYellow transition-colors duration-300">
              <FaArrowLeft className="w-3" />
              Back
            </span>
          </Link>

          {loadingReservation ? (
            <div className="flex items-center justify-center py-40">
              <div className="animate-spin rounded-full w-12 h-12 border-t-4 border-b-4 border-softBeigeYellow"></div>
            </div>
          ) : reservation ? (
            <div className="bg-deepGray py-6 sm:py-10 px-4 space-y-8 lg:space-y-16 rounded-lg ">
              <aside className="flex items-center justify-center">
                <div className="flex flex-col justify-center items-center gap-3 lg:gap-6">
                  <FaUser className="text-6xl sm:text-7xl md:text-8xl lg:text-[8rem] rounded-full border py-2 text-lightGray" />
                  <div
                    className="flex flex-col items-center gap-1
                     lg:gap-2 text-xs sm:text-sm lg:text-base max-w-60 sm:max-w-80 lg:max-w-full mx-auto text-center"
                  >
                    <h2 className="capitalize font-bold text-lg md:text-xl xl:text-3xl">
                      {reservation.fullname}
                    </h2>
                    <p className="text-gray-300">{reservation.email}</p>
                    <p className="text-gray-300">Phone: {reservation.phone}</p>
                  </div>
                </div>
              </aside>

              <div className="space-y-10">
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2
                 lg:gap-6 text-sm sm:text-base text-gray-300"
                >
                  <div className="flex items-center gap-3 bg-darkCharcoal rounded-lg p-4">
                    <FaUsers className="text-goldYellow" />
                    <p className="">
                      <span className="">People: </span>
                      {reservation.people}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-darkCharcoal rounded-lg p-4">
                    <FaCalendarAlt className="text-goldYellow" />
                    <p className="">
                      <span className="">Date: </span>
                      {formDate(reservation.date)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-darkCharcoal rounded-lg p-4">
                    <FaClock className="text-goldYellow" />
                    <p className="">Time: {formattedDate}</p>
                  </div>

                  <div className="flex items-center gap-3 bg-darkCharcoal rounded-lg p-4">
                    <FaChair className="text-goldYellow" />
                    <p className="">
                      <span className="">Table: </span>
                      {reservation.table}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-darkCharcoal rounded-lg p-4">
                    <FaInfoCircle className="text-goldYellow" />
                    <p className="">
                      <span className="">Status: </span>
                      <span
                        className={`px-3 pt-0.5 pb-1 rounded-full text-xs sm:text-sm ${statusColor[reservation.status]}`}
                      >
                        {reservation.status}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-darkCharcoal rounded-lg p-4">
                    <FaEnvelope className="text-goldYellow" />
                    <p className="">
                      <span className="">Subscribed: </span>
                      {reservation.newsletter ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>

                {reservation.comments && (
                  <div className="bg-darkCharcoal rounded-lg p-4 lg:p-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <FaCommentDots className="text-goldYellow" />
                      <h3 className="font-semibold text-lightGray text-sm lg:text-lg">
                        Comments
                      </h3>
                    </div>

                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                      {reservation.comments}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-20 px-4 gap-2 md:gap-4 pt-10">
              <div className="space-y-10 lg:space-y-16 flex flex-col items-center">
                <div
                  className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full bg-deepGray border border-red 
                    shadow-[0_0_0.5rem] shadow-red animate-ping"
                >
                  <FaTimesCircle className="text-lg md:text-2xl lg:text-3xl text-red" />
                </div>

                <h3 className="text-2xl md:text-3xl font-semibold text-lightGray text-center">
                  Reservation not found!
                </h3>
              </div>

              <p className="text-center text-gray-400 max-w-xs md:max-w-md">
                Oops! We couldn’t find this reservation.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default ReservationDetails;
