import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaHourglassHalf,
  FaDollarSign,
  FaTruck,
  FaTimesCircle,
} from "react-icons/fa";

function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrders(res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Server Error");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const cancelOrders = async (orderId) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(res.data.message);

      // Update order status locally
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const confirmCancel = (orderId) => {
    setIsConfirmOpen(true);
    toast.warning(
      <div className="flex flex-col gap-2">
        <p className="">Are you sure to cancle the order?</p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              cancelOrders(orderId);
              setIsConfirmOpen(false);
              toast.dismiss();
            }}
            className="border-2 border-green-400 hover:text-green-400 transition-colors duration-300 px-3 py-0.5 rounded-3xl"
          >
            Yes
          </button>

          <button
            onClick={() => {
              toast.dismiss();
              setIsConfirmOpen(false);
            }}
            className="border-2 border-red hover:text-red transition-colors duration-300 px-3 py-0.5 rounded-3xl"
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeButton: false, closeOnClick: false }
    );
  };

  if (loading) {
    return (
      <>
        <div className="flex justify-center items-center min-h-screen gap-2 md:gap-3">
          <span className="text-lightGray text-lg md:text-xl lg:text-2xl xl:text-3xl text-center">
            Loading Orders
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

  if (orders.length === 0) {
    return (
      <>
        <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
          <p className="text-xl md:text-2xl lg:text-3xl">
            You have no orders yet :)
          </p>
          <Link to="/">
            <span className="my-4 text-lightGray font-cinzel hover:underline flex items-center justify-start gap-2 hover:text-goldYellow transition-colors duration-300">
              <FaArrowLeft className="w-3" />
              Back to home
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
            My Orders
          </h2>

          <div className="">
            <ul className="space-y-10">
              {orders.map((order) => {
                const canCancel = order.status === "pending";

                return (
                  <li
                    className="bg-deepGray border border-lightGray rounded-lg p-4 md:p-6"
                    key={order._id}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 lg:gap-10">
                      <div className="sm:max-w-80 md:max-w-96 space-y-6">
                        <div className="flex gap-4 md:gap-6 items-center">
                          <div className="">
                            <img
                              src="images/sushi-palate.webp"
                              alt="sushi palate"
                              className="w-24 md:w-28 lg:w-32"
                              width={128}
                              height={156}
                            />
                          </div>

                          <div className="flex flex-col gap-1 text-xs sm:text-sm md:text-base">
                            <span className="">
                              Order ID: #{order._id.slice(-6)}
                            </span>
                            <span className="">
                              Date: {new Date(order.createdAt).toLocaleString()}
                            </span>
                            <span className="">
                              Total:{" "}
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
                              return item.title + " " + item.qty + "x";
                            } else {
                              return item.title + " " + item.qty + "x" + ", ";
                            }
                          })}
                        </p>
                      </div>

                      <div className="flex sm:flex-col lg:flex-row items-center gap-4 lg:gap-16">
                        <span
                          className={`flex items-center gap-2 text-sm md:text-base ${
                            order.status === "pending"
                              ? "text-softBeigeYellow"
                              : order.status === "paid"
                                ? "text-blue-400"
                                : order.status === "shipped"
                                  ? "text-indigo-400"
                                  : order.status === "completed"
                                    ? "text-green-400"
                                    : "text-red"
                          }`}
                        >
                          {order.status === "pending" ? (
                            <FaHourglassHalf />
                          ) : order.status === "paid" ? (
                            <FaDollarSign />
                          ) : order.status === "shipped" ? (
                            <FaTruck />
                          ) : order.status === "completed" ? (
                            <FaCheckCircle />
                          ) : (
                            <FaTimesCircle />
                          )}
                          {order.status}
                        </span>

                        <div className="">
                          <button
                            type="submit"
                            onClick={() =>
                              canCancel &&
                              !isConfirmOpen &&
                              confirmCancel(order._id)
                            }
                            disabled={isConfirmOpen || loading || !canCancel}
                            className={`flex text-red px-3 py-1 border border-red rounded-md text-sm sm:text-base lg:text-lg
                            transition-colors duration-300 font-bold items-center gap-1 font-cormorantSC
                            ${loading || isConfirmOpen ? "cursor-not-allowed opacity-70" : ""} ${!canCancel ? "border-gray-400 text-gray-400 cursor-not-allowed" : ""}`}
                            data-tip={
                              canCancel
                                ? "Cancel this order"
                                : "Only pending orders can be cancelled"
                            }
                          >
                            {loading ? "Canceling..." : "Cancel Order"}
                          </button>
                          <Tooltip place="top" type="dark" effect="solid" />
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

export default MyOrder;
