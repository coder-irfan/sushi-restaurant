import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaCalendarCheck,
  FaUserTimes,
} from "react-icons/fa";
import { useEffect, useState } from "react";

function MyBooking() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchReservations = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/reservation`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setReservations(res.data.reservations || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Server error");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const cancleReservation = async (reservationId) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/reservation/${reservationId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(res.data.message);

      // Update reservation status locally
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation._id === reservationId
            ? { ...reservation, status: "cancelled" }
            : reservation
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel reservation"
      );
    }
  };

  const confirmCancel = (reservationId) => {
    setIsConfirmOpen(true);
    toast.warning(
      <div className="flex flex-col gap-2">
        <p className="">Are you sure to cancle the table?</p>

        <div className="flex items-center gap-2">
          <button
            className="border-2 border-green-400 hover:text-green-400 transition-colors duration-300 px-3 py-0.5 rounded-3xl"
            onClick={() => {
              cancleReservation(reservationId); // Backend logic
              toast.dismiss(); // Close the confirmation toast
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
      { autoClose: false, closeOnClick: false, closeButton: false }
    );
  };

  if (loading) {
    return (
      <>
        <div className="flex justify-center items-center min-h-screen gap-2 md:gap-3">
          <span className="text-lightGray text-lg md:text-xl lg:text-2xl xl:text-3xl text-center">
            Loading Reservations
          </span>
          <div className="flex justify-center items-center gap-1 md:gap-2">
            <div className="w-2 h-2 bg-goldYellow rounded-full animate-bounce1"></div>
            <div className="w-2 h-2 bg-goldYellow rounded-full animate-bounce2"></div>
            <div className="w-2 h-2 bg-goldYellow rounded-full animate-bounce3"></div>
          </div>
        </div>
      </>
    );
  }

  if (reservations.length === 0) {
    return (
      <>
        <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
          <p className="text-xl md:text-2xl lg:text-3xl">
            You have no reservations yet :)
          </p>
          <Link to="/reservation">
            <span className="my-4 text-lightGray font-cinzel hover:underline flex items-center justify-start gap-2 hover:text-goldYellow transition-colors duration-300">
              <FaArrowLeft className="w-3" />
              Reserve table
            </span>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <section className="max-w-6xl mx-auto py-20 px-4 md:px-10 xl:px-0">
        <div className="space-y-8">
          <Link to="/">
            <span className="my-4 text-lightGray font-cinzel hover:underline flex items-center justify-start gap-2 hover:text-goldYellow transition-colors duration-300">
              <FaArrowLeft className="w-3" />
              Back to home
            </span>
          </Link>

          <h2 className="text-lightGray font-medium text-xl md:text-2xl lg:text-3xl">
            My Reservations
          </h2>

          <div className="">
            <ul className="space-y-10">
              {reservations.map((reservation) => {
                const canCancel =
                  reservation.status === "pending" ||
                  reservation.status === "completed";

                return (
                  <li
                    className="bg-deepGray border border-lightGray rounded-lg p-4 md:p-6"
                    key={reservation._id}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 lg:gap-10">
                      <div className="sm:max-w-80 md:max-w-96 space-y-6">
                        <div className="flex gap-4 md:gap-6 items-center">
                          {reservation.table === "Fine | $500" ? (
                            <img
                              src="images/fine-chair.webp"
                              alt="fine chair"
                              className="w-24 md:w-28 lg:w-32"
                              width={128}
                              height={156}
                            />
                          ) : reservation.table === "Gold | $1000" ? (
                            <img
                              src="images/golden-chair.webp"
                              alt="golden chair"
                              className="w-24 md:w-28 lg:w-32"
                              width={128}
                              height={156}
                            />
                          ) : reservation.table === "Royalty | $1500" ? (
                            <img
                              src="images/luxury-chair.webp"
                              alt="luxury chair"
                              className="w-24 md:w-28 lg:w-32"
                              width={128}
                              height={156}
                            />
                          ) : (
                            ""
                          )}

                          <div className="flex flex-col gap-1 text-xs sm:text-sm md:text-base">
                            <span className="">
                              Reservation ID: #{reservation._id.slice(-6)}
                            </span>
                            <span className="">
                              Table:{" "}
                              <strong className="text-softBeigeYellow">
                                {reservation.table}
                              </strong>
                            </span>
                            <span className="">
                              Date:{" "}
                              {new Date(reservation.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                            <span className="">
                              Time:{" "}
                              {new Date(
                                `1970-01-01T${reservation.time}`
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                            <span className="">
                              People: {reservation.people}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm md:text-base !leading-relaxed">
                          Comments:{" "}
                          {reservation.comments
                            ? reservation.comments
                            : "No comments provided"}
                        </p>
                      </div>

                      <div className="flex sm:flex-col lg:flex-row items-center gap-4 lg:gap-16">
                        <span
                          className={`flex items-center gap-2 text-sm md:text-base ${
                            reservation.status === "pending"
                              ? "text-softBeigeYellow"
                              : reservation.status === "confirmed"
                                ? "text-blue-400"
                                : reservation.status === "no-show"
                                  ? "text-indigo-400"
                                  : reservation.status === "completed"
                                    ? "text-green-400"
                                    : "text-red"
                          }`}
                        >
                          {reservation.status === "pending" ? (
                            <FaHourglassHalf />
                          ) : reservation.status === "confirmed" ? (
                            <FaCalendarCheck />
                          ) : reservation.status === "no-show" ? (
                            <FaUserTimes />
                          ) : reservation.status === "completed" ? (
                            <FaCheckCircle />
                          ) : (
                            <FaTimesCircle />
                          )}
                          {reservation.status}
                        </span>

                        <div className="">
                          <button
                            type="submit"
                            onClick={() =>
                              canCancel &&
                              !isConfirmOpen &&
                              confirmCancel(reservation._id)
                            }
                            disabled={isConfirmOpen || !canCancel || loading}
                            className={`flex text-red px-3 py-1 border border-red rounded-md text-sm sm:text-base lg:text-lg
                            transition-colors duration-300 font-bold items-center gap-1 font-cormorantSC
                            ${loading || isConfirmOpen ? "cursor-not-allowed opacity-70" : ""} ${!canCancel ? "border-gray-400 text-gray-400 cursor-not-allowed" : ""}`}
                            data-tip={
                              canCancel
                                ? "Cancel this table"
                                : "Only pending or confirmed tables can be cancelled"
                            }
                          >
                            {loading ? "Canceling..." : "Cancel table"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export default MyBooking;
