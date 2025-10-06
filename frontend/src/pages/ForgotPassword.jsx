import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

function ForgotPassword() {
  const {register, handleSubmit, formState: {errors} } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgotpassword`, {
        ...data 
      }
    );
    toast.success(res.data.message);  // Password reset email sent!
  } catch (error) {
    console.error("Error:", error.response?.data?.message || error.message);
    toast.error(error.response?.data?.message || "Something went wrong!");
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  if(errors.email) toast.error(errors.email.message);
}, [errors.email]);

  return (
    <>
      <section className="flex justify-center items-center min-h-screen py-10 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">

          <Link to={'/login'}>
            <span className="my-4 text-lightGray font-cinzel hover:underline flex justify-start items-center gap-2 hover:text-goldYellow transition-colors duration-300">
              <FaArrowLeft className="w-3" />
              Back
            </span>
          </Link>

          <div className="grid lg:grid-cols-2 items-center gap-10">
            <div className="space-y-10 lg:space-y-16">

              <h2 className="text-lightGray font-medium text-2xl lg:text-3xl xl:text-[2.5rem] text-left">
                Forgot Password
              </h2>

              <form className="flex flex-col gap-6 lg:gap-10" onSubmit={handleSubmit(onSubmit)}>

                <div className="space-y-2 w-full">
                  <label className="text-lightGray text-sm lg:text-base">Email</label>
                  <div className="">
                    <input
                      autoFocus={true}
                      type="email" 
                      className={`input ${errors.email ? '!border-red' : ''}`}
                      {...register('email', {
                        required: "Please enter your email!"
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="error">{errors.email.message}</p>
                  )}
                </div> 

                <div className="flex justify-between items-center gap-4">
                  <button 
                    type="submit"
                    disabled={loading}
                    className={`bg-goldYellow shadow-[0_0_0.2rem] shadow-goldYellow text-darkCharcoal font-cormorantSC font-semibold w-full max-w-28 lg:max-w-40 md:text-lg
                    lg:text-xl py-1 hover:bg-softBeigeYellow hover:shadow-softBeigeYellow transition-color duration-300 rounded-md
                    ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
                  >
                    {loading ? 'Sending...' : 'Send Email'}
                  </button>

                  <div className="flex justify-between items-center">
                    <Link 
                      to={'/login'} 
                      className="underline hover:no-underline font-medium text-lightGray hover:text-goldYellow transition-colors duration-300"
                    >
                      Back to Login
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            <div className="">
              <img 
                src="/images/shrimp-sushi.webp"
                alt="shrimp-sushi"
                className="flex rounded-2xl w-[28.125rem] sm:w-[33.125rem] md:w-[34.375rem] h-52 lg:h-full lg:max-w-md xl:max-w-xl object-cover" 
              />
            </div>
            
          </div>
        </div>
      </section>
    </>
  )
}

export default ForgotPassword;