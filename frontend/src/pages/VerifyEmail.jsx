import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

function VerifyEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/verify/${token}`
        );
        const data = await res.json();

        if (data.success) {
          setMessage("🎉 Your email has been successfully verified!");
        } else {
          setMessage("❌ Verification failed or token expired.");
        }
      } catch (error) {
        setMessage("Something went wrong.");
      }
    };
    verify();
  }, [token]);

  return (
    <>
      <section className="flex justify-center items-center min-h-screen p-6 md:px-4">
        <div className="flex flex-col items-center justify-center gap-8 lg:gap-16 bg-deepGray shadow-2xl rounded-sm shadow-black px-8 py-10 lg:px-20 lg:py-16">
          <FaCheckCircle className="text-goldYellow text-5xl lg:text-6xl" />
          <div className="text-center">
            <p className="text-lg md:text-xl lg:text-2xl max-w-lg">{message}</p>
          </div>

          <Link to="/">
            <span className="my-4 text-lightGray  hover:underline flex items-center justify-start gap-2 hover:text-goldYellow transition-colors duration-3">
              <FaArrowLeft className="w-3" />
              Go to homepage
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}

export default VerifyEmail;
