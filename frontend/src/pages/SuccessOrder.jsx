import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaClipboardCheck,
  FaArrowLeft,
  FaStore,
} from "react-icons/fa";

function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
        <p className="text-2xl md:text-3xl lg:text-[2.5rem]">
          No order found :(
        </p>
        <Link to="/">
          <span className="my-4 text-lightGray font-cinzel hover:underline flex items-center justify-start gap-2 hover:text-goldYellow transition-colors duration-300">
            <FaArrowLeft className="w-3" />
            Back
          </span>
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="flex justify-center items-center min-h-screen p-6 md:px-4">
        <div className="flex flex-col items-center justify-center gap-8 lg:gap-16 bg-deepGray shadow-2xl rounded-sm shadow-black px-8 py-10 lg:px-20 lg:py-16">
          <FaCheckCircle className="text-goldYellow text-5xl lg:text-6xl" />
          <div className="text-center space-y-4 lg:space-y-6">
            <h2 className="text-lightGray font-medium text-2xl lg:text-3xl xl:text-[2.5rem]">
              Order placed!
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl max-w-lg">
              Thank you,{" "}
              <strong className="text-softBeigeYellow">
                {order.fullname},
              </strong>{" "}
              your order has been successfully placed!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6">
            <Link to="/myorder">
              <button
                className="bg-goldYellow uppercase shadow-[0_0_0.2rem] shadow-goldYellow text-darkCharcoal font-cormorantSC font-semibold px-4 py-2
                lg:text-lg hover:bg-softBeigeYellow hover:shadow-softBeigeYellow transition-color duration-300 flex items-center gap-2"
              >
                <FaClipboardCheck />
                My orders -----
              </button>
            </Link>

            <Link to="/">
              <button
                className="uppercase font-cormorantSC text-goldYellow border-2 border-goldYellow px-3 py-1.5 shadow-[0_0_0.3rem] lg:text-lg hover:text-softBeigeYellow
                hover:border-softBeigeYellow transition-colors duration-300 font-semibold flex items-center gap-3"
              >
                <FaStore />
                Continue shopping -----
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default OrderSuccess;
