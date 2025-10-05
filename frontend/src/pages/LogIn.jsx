import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEyeSlash, FaEye } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "../contexts/AuthContext";

function LogIn() {
  const {register, handleSubmit, formState: { errors }, reset} = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [captchaValue, setCaptchaValue] = useState(null);

  const { login } = useAuth();

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      if (!captchaValue) {
        toast.error("Please complete the CAPTCHA!");
        return;
      }

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        ...data,
        rememberMe: !!data.rememberMe,
        captcha: captchaValue,
      }, {
        headers: { "Content-Type": "application/json" }
      });

      const result = res.data;

      // Use context login to update state and storage
      login(result.token, result.user, data.rememberMe);

      toast.success(result.message);

      navigate("/");
      reset();
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error("Too many login attempts. Try again later!");
      } else if (error.response?.status === 401) {
        toast.error(error.response?.data.message || "Invalid credentials");
      } else {
        toast.error("Something went wrong!")
      }
    } finally {
      setLoading(false);
    }
  }

  const onError = (errors) => {
    toast.error("Please fill all input fields!")
  }

  return (
    <>
      <section className="flex justify-center items-center min-h-screen py-10 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">

          <Link to="/">
            <span className="my-2 text-lightGray font-cinzel hover:underline flex justify-start items-center gap-2 hover:text-goldYellow transition-colors duration-300">
              <FaArrowLeft className="w-3" />
              Back
            </span>
          </Link>

          <div className="grid lg:grid-cols-2 items-center gap-10">
            <div className="space-y-6 sm:space-y-10 xl:space-y-14">

              <h2 className="text-lightGray font-medium text-2xl lg:text-3xl xl:text-[2.5rem] text-center lg:text-left">
                Log In
              </h2>

              <form className="flex flex-col gap-4" autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
                <div className="space-y-2 w-full">
                  <label htmlFor="email" className="text-lightGray text-sm lg:text-base">Email</label>
                    <div className="">
                      <input 
                        id="email"
                        autoFocus={true}
                        type="email"
                        className={`input ${errors.email ? '!border-red' : ''}`}
                        {...register('email', {
                          required: "Please enter your email!",
                          pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Please enter a valid email!"
                          }
                        })}
                      />
                    </div>
                  {errors.email && (
                    <p className="error">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2 w-full">
                  <label htmlFor="password" className="text-lightGray text-sm lg:text-base">Password</label>
                    <div className="relative">
                      <input 
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="off"
                        className={`input ${errors.password ? '!border-red' : ''}`}
                        {...register('password', {
                          required: "Please enter your password!",
                        })}
                      />
                      <span 
                        onClick={() => setShowPassword(!showPassword)}
                        className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-4"
                      >
                        {showPassword ? <FaEye className="w-4 lg:w-6 text-goldYellow" /> : <FaEyeSlash className="w-4 lg:w-6 text-goldYellow" />}
                      </span>
                    </div>
                  {errors.password && (
                    <p className="error">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 lg:py-2 justify-between">
                  <label>
                    <div className="flex items-center gap-2">
                      <div className="">
                        <input 
                          type="checkbox" 
                          defaultChecked={true}
                          className="scale-100 cursor-pointer accent-goldYellow"
                          {...register("rememberMe")}
                        />
                      </div>
                      
                      <div className="text-lightGray text-sm">
                        Remember me
                      </div>
                    </div>
                  </label>
            
                  <div className="">
                    <Link to="/forgotpassword">
                      <span className="underline text-red transition-colors font-medium duration-300 hover:text-goldYellow text-sm">
                        Forgot Password?
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <button 
                    type="submit"
                    disabled={loading}
                    className={`bg-goldYellow shadow-[0_0_0.2rem] shadow-goldYellow text-darkCharcoal font-cormorantSC font-semibold w-full max-w-28 lg:max-w-40 md:text-lg
                    lg:text-xl py-1 hover:bg-softBeigeYellow hover:shadow-softBeigeYellow transition-color duration-300 rounded-md
                    ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
                  >
                    {loading ? 'Logging...' : 'Log In'}
                  </button>

                  <ReCAPTCHA 
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={handleCaptchaChange}
                  />
                </div>

                {error && <p className="flex justify-center items-center text-red">{error}</p>}

                <div className="mt-4 flex justify-between items-center">
                  <p className="text-lightGray">
                    Don't have an account?
                  </p>

                  <div className="">
                    <Link 
                      to="/signup" 
                      className="underline hover:no-underline font-medium text-lightGray hover:text-goldYellow transition-colors duration-300"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            <div className="">
              <img 
                src="images/shrimp-sushi.webp"
                alt="shrimp-sushi"
                className="rounded-2xl w-[28.125rem] sm:w-[33.125rem] md:w-[34.375rem] h-52 lg:h-full lg:max-w-lg xl:max-w-xl object-cover" 
              />
            </div>
            
          </div>
        </div>
      </section>
    </>
  )
}

export default LogIn;