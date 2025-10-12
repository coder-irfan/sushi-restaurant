import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegEnvelope, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

function CheckEmail() {
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("verifyEmail");

  const handleResend = async () => {
    try {
      setLoading(true);

      if (!email) {
        toast.error("Email not found");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/resend-verification`,
        {
          email,
        }
      );
      toast.success(response.data.message);
      setResent(true);
      setTimeout(() => {
        setResent(false);
      }, 10000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="flex justify-center items-center min-h-screen p-6 md:px-4">
        <div className="flex flex-col items-center justify-center gap-8 lg:gap-16 bg-deepGray shadow-2xl rounded-sm shadow-black px-8 py-10 lg:px-20 lg:py-16">
          <FaRegEnvelope className="text-goldYellow text-5xl lg:text-6xl" />
          <div className="text-center space-y-4 lg:space-y-6">
            <h2 className="text-lightGray font-medium text-2xl lg:text-3xl xl:text-[2.5rem]">
              Verify Your Email
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl max-w-lg">
              We’ve sent you a{" "}
              <strong className="text-softBeigeYellow">
                verification link.
              </strong>{" "}
              Please check your inbox (or spam folder).
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-6">
            <button
              onClick={handleResend}
              disabled={loading || resent}
              className={`bg-goldYellow shadow-[0_0_0.2rem] shadow-goldYellow text-darkCharcoal font-cormorantSC font-semibold w-full max-w-28 lg:max-w-56 md:text-lg
                lg:text-xl py-1 px-4 hover:bg-softBeigeYellow hover:shadow-softBeigeYellow transition-color duration-300 rounded-md
                ${loading ? "cursor-not-allowed opacity-70" : ""}`}
            >
              {loading
                ? "Sending..."
                : resent
                  ? "Email sent"
                  : "Resend verification"}
            </button>

            <Link to="/login">
              <span className="text-lightGray font-cinzel hover:underline flex items-center justify-start gap-2 hover:text-goldYellow transition-colors duration-300">
                <FaArrowLeft className="w-3" />
                Back to login
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default CheckEmail;
