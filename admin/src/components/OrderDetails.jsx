import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAdminAuth } from '../context/AdminAuthContext';
import { FaArrowLeft, FaTimesCircle, FaUser } from 'react-icons/fa';

function OrderDetails() {
  const [order, setOrder] = useState(null);
  const { id } = useParams();
  const { token } = useAdminAuth();

  const [loadingOrder, setLoadingOrder] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoadingOrder(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch order!');
      } finally {
        setLoadingOrder(false);
      }
    };
    fetchOrder();
  }, [id, token]);

  return (
    <>
      <section className="max-w-6xl mx-auto pt-4 md:pt-10 py-20 px-4 md:px-10 xl:px-0">
        <div className="space-y-6 sm:space-y-10">
          <Link to="/admin/dashboard/orders">
            <span className="my-2 text-lightGray font-cinzel hover:underline flex justify-start items-center gap-2 hover:text-goldYellow transition-colors duration-300">
              <FaArrowLeft className="w-3" />
              Back
            </span>
          </Link>

          {loadingOrder ? (
            <div className="flex items-center justify-center py-40">
              <div className="animate-spin rounded-full w-12 h-12 border-t-4 border-b-4 border-softBeigeYellow"></div>
            </div>
          ) : order ? (
            <div className="bg-deepGray py-6 sm:py-10 px-4 space-y-14 lg:space-y-20 rounded-lg">
              <aside className="flex items-center justify-center">
                <div className="flex flex-col justify-center items-center gap-3 lg:gap-6">
                  <FaUser className="text-6xl sm:text-7xl md:text-8xl lg:text-[8rem] rounded-full border py-2 text-lightGray" />
                  <div
                    className="flex flex-col items-center gap-1
                   lg:gap-2 text-xs sm:text-sm lg:text-base max-w-60 sm:max-w-80 lg:max-w-full mx-auto text-center"
                  >
                    <h2 className="first-letter:capitalize font-bold text-lg md:text-xl xl:text-3xl">
                      {order.fullname}
                    </h2>
                    <p className="text-gray-300">{order.email}</p>
                    <p className="text-gray-300">Phone: {order.phone}</p>

                    <address className="pt-2">
                      <p className="text-gray-300">
                        Address:{' '}
                        <span className="">
                          {' '}
                          {order.country}, {order.city}, {order.address} -{' '}
                          {order.zipcode}{' '}
                        </span>
                      </p>
                    </address>
                  </div>
                </div>
              </aside>

              <div className="w-full">
                <div className="">
                  <table className="w-full text-left border-collapse mb-3">
                    <thead className="text-gray-400 border-b border-gray-700">
                      <tr className="">
                        <th className="pb-3 md:pb-4 px-2 text-sm sm:text-base md:text-lg">
                          Item Name:
                        </th>
                        <th className="pb-3 md:pb-4 px-2 text-sm sm:text-base md:text-lg">
                          Qty:
                        </th>
                        <th className="pb-3 md:pb-4 px-2 text-sm sm:text-base md:text-lg">
                          Price:
                        </th>
                        <th className="pb-3 md:pb-4 px-2 text-sm sm:text-base md:text-lg">
                          Total:
                        </th>
                      </tr>
                    </thead>

                    <tbody className="">
                      {order.items.map((item, index) => (
                        <tr
                          className="border-b border-gray-700 even:bg-deepGray odd:bg-darkCharcoal hover:bg-darkCharcoal transition-colors duration-100"
                          key={index}
                        >
                          <td className="py-3 md:py-4 px-2 text-xs sm:text-sm lg:text-base">
                            {item.title}
                          </td>
                          <td className="py-3 md:py-4 px-2 text-xs sm:text-sm lg:text-base">
                            {item.qty}x
                          </td>
                          <td className="py-3 md:py-4 px-2 text-xs sm:text-sm lg:text-base">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="py-3 md:py-4 px-2 text-xs sm:text-sm lg:text-base">
                            ${(item.price * item.qty).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    <tfoot className="">
                      <tr className="bg-darkCharcoal">
                        <td className="py-4 md:py-8 px-2 text-sm sm:text-base lg:text-lg text-softBeigeYellow">
                          All sushis
                        </td>
                        <td className="py-4 md:py-8 px-2 text-sm sm:text-base lg:text-lg text-softBeigeYellow">
                          {order.items.length}x
                        </td>
                        <td className="py-4 md:py-8 px-2 text-sm sm:text-base lg:text-lg text-softBeigeYellow"></td>
                        <td className="py-4 md:py-8 px-2 text-sm sm:text-base lg:text-lg text-softBeigeYellow">
                          ${order.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
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
                  Order not found!
                </h3>
              </div>

              <p className="text-center text-gray-400 max-w-xs md:max-w-md">
                Oops! We couldn’t find this order.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default OrderDetails;
