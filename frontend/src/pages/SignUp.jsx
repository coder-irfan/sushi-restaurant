import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEyeSlash, FaEye } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const password = watch("password");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

  const [captchaValue, setCaptchaValue] = useState(null);

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const navigate = useNavigate();

  /* when a user fills in the signup form and clicks submit, this line sends their information to server.
  The backend will check if the user already exists, save them in the database, and return a response (usually a JWT token). */
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (!captchaValue) {
        toast.error("Please complete the CAPTCHA!");
        return;
      }

      // Send data to backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          ...data,
          captcha: captchaValue,
        }
      );

      toast.success(response.data.message);
      reset();

      // Save email for resend verification
      localStorage.setItem("verifyEmail", data.email);

      // Redirect to login
      navigate("/check-email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Somthing went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors) => {
    toast.error("Please fill all input fields!");
  };

  return (
    <>
      <section className="flex justify-center items-center min-h-screen py-10 px-4 md:px-10">
        <div className="max-w-6xl mx-auto relative">
          <Link to="/">
            <span
              className="my-4 text-lightGray font-cinzel hover:underline flex items-center justify-start gap-2 hover:text-goldYellow transition-colors duration-300
              "
            >
              <FaArrowLeft className="w-3" />
              Back
            </span>
          </Link>

          <div className="grid lg:grid-cols-2 items-center gap-10">
            <div className="space-y-10 xl:space-y-16">
              <h2 className="text-lightGray font-medium text-2xl lg:text-3xl xl:text-[2.5rem] text-left">
                Sign Up
              </h2>

              <form
                className="flex flex-col gap-4"
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit, onError)}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="space-y-2 w-full sm:w-1/2">
                    <label className="text-lightGray text-sm lg:text-base">
                      Full Name
                    </label>
                    <div className="">
                      <input
                        autoFocus={true}
                        type="text"
                        className={`input ${errors.fullname ? "!border-red" : ""}`}
                        {...register("fullname", {
                          required: "Please enter your name!",
                        })}
                      />
                    </div>
                    {errors.fullname && (
                      <p className="error">{errors.fullname.message}</p>
                    )}
                  </div>

                  <div className="space-y-2 w-full sm:w-1/2">
                    <label className="text-lightGray text-sm lg:text-base">
                      Email
                    </label>
                    <div className="">
                      <input
                        type="email"
                        autoComplete="off"
                        className={`input ${errors.email ? "!border-red" : ""}`}
                        {...register("email", {
                          required: "Please enter your email!",
                          pattern: {
                            value:
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Please enter a valid email!",
                          },
                        })}
                      />
                    </div>
                    {errors.email && (
                      <p className="error">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 w-full">
                  <label className="text-lightGray text-sm lg:text-base">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="off"
                      className={`input ${errors.password ? "!border-red" : ""}`}
                      {...register("password", {
                        required: "Please enter a password!",
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                          message:
                            "Password must include uppercase, lowercase, number, and symbol!",
                        },
                      })}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-4"
                    >
                      {showPassword ? (
                        <FaEye className="w-4 lg:w-6 text-goldYellow" />
                      ) : (
                        <FaEyeSlash className="w-4 lg:w-6 text-goldYellow" />
                      )}
                    </span>
                  </div>
                  {errors.password && (
                    <p className="error">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2 w-full">
                  <label className="text-lightGray text-sm lg:text-base">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmedPassword ? "text" : "password"}
                      className={`input ${errors.confirmpassword ? "!border-red" : ""}`}
                      autoComplete="off"
                      {...register("confirmpassword", {
                        required: "Please confirm your password!",
                        validate: (value) =>
                          value === password || "Password did not match!",
                      })}
                    />
                    <span
                      onClick={() =>
                        setShowConfirmedPassword(!showConfirmedPassword)
                      }
                      className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-4"
                    >
                      {showConfirmedPassword ? (
                        <FaEye className="w-4 lg:w-6 text-goldYellow" />
                      ) : (
                        <FaEyeSlash className="w-4 lg:w-6 text-goldYellow" />
                      )}
                    </span>
                  </div>
                  {errors.confirmpassword && (
                    <p className="error">{errors.confirmpassword.message}</p>
                  )}
                </div>

                <div className="">
                  <label className="flex items-center gap-2 md:py-3">
                    <input
                      type="checkbox"
                      name="checkbox"
                      defaultChecked={true}
                      className="scale-100 cursor-pointer accent-goldYellow"
                      {...register("checkbox", {
                        required: "You must agree to the terms!",
                      })}
                    />

                    <div className="text-lightGray text-sm">
                      I Agree with <b>privacy</b> and <b>policy</b>
                    </div>
                  </label>
                  {errors.checkbox && (
                    <p className="error">{errors.checkbox.message}</p>
                  )}
                </div>

                <div className="flex flex-col md:flex-row gap-6 md:justify-between md:items-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-goldYellow shadow-[0_0_0.2rem] shadow-goldYellow text-darkCharcoal font-cormorantSC font-semibold w-full max-w-28 lg:max-w-40 md:text-lg
                    lg:text-xl py-1 hover:bg-softBeigeYellow hover:shadow-softBeigeYellow transition-color duration-300 rounded-md
                    ${loading ? "cursor-not-allowed opacity-70" : ""}`}
                  >
                    {loading ? "Signing Up..." : "Sign Up"}
                  </button>

                  <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={handleCaptchaChange}
                  />
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <p className="text-lightGray">Already have an account?</p>

                  <div className="">
                    <Link
                      to="/login"
                      className="underline hover:no-underline font-medium text-lightGray hover:text-goldYellow transition-colors duration-300"
                    >
                      Log In
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            <div className="">
              <img
                src="images/shrimp-sushi.webp"
                alt="shrimp-sushi"
                className="flex rounded-2xl w-[28.125rem] sm:w-[33.125rem] md:w-[34.375rem] h-52 lg:h-full lg:max-w-md xl:max-w-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignUp;
