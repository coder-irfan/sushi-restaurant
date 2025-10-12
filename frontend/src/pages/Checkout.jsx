import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import countriesData from "../countries/data.json";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

function Checkout({ setCartItems }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const cartItems = location.state?.cartItems || [];
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const navigate = useNavigate();

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setValue("country", country);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          ...data,
          items: cartItems.map((item) => ({
            productId: item._id,
            title: item.title,
            img: item.img,
            price: item.price,
            qty: item.qty,
          })),
          totalAmount: totalAmount,
          status: "pending",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(res.data.message);
      setLoading(false);
      reset();
      setCartItems([]);
      navigate("/order-success", { state: { order: res.data.order } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error!");
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
            <span className="my-4 text-lightGray font-cinzel hover:underline flex items-center justify-start gap-2 hover:text-goldYellow transition-colors duration-300">
              <FaArrowLeft className="w-3" />
              Back
            </span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-6 lg:space-y-10 xl:space-y-16">
              <h2 className="text-lightGray font-medium text-2xl lg:text-3xl xl:text-[2.5rem] text-left">
                Checkout
              </h2>

              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit, onError)}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="space-y-2 w-full sm:w-1/2">
                    <label
                      htmlFor="fullname"
                      className="text-lightGray text-sm lg:text-base"
                    >
                      Full Name
                    </label>
                    <div className="">
                      <input
                        id="fullname"
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
                    <label
                      htmlFor="email"
                      className="text-lightGray text-sm lg:text-base"
                    >
                      Email
                    </label>
                    <div className="">
                      <input
                        id="email"
                        type="email"
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

                <div className="flex items-center justify-center gap-2">
                  <div className="space-y-2 w-full sm:w-1/2">
                    <label
                      htmlFor="country"
                      className="text-lightGray text-sm lg:text-base"
                    >
                      Country
                    </label>
                    <div className="">
                      <select
                        id="country"
                        onChange={handleCountryChange}
                        className={`input cursor-pointer ${errors.country ? "!border-red" : ""}`}
                        {...register("country", {
                          required: "Please add you country!",
                        })}
                      >
                        <option value="">Select Country</option>
                        {Object.keys(countriesData).map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.country && (
                      <p className="error">{errors.country.message}</p>
                    )}
                  </div>

                  <div className="space-y-2 w-full sm:w-1/2">
                    <label
                      htmlFor="city"
                      className="text-lightGray text-sm lg:text-base"
                    >
                      City
                    </label>
                    <div className="">
                      <input
                        id="city"
                        type="text"
                        className={`input ${errors.city ? "!border-red" : ""}`}
                        {...register("city", {
                          required: "Please enter your city!",
                        })}
                      />
                    </div>
                    {errors.city && (
                      <p className="error">{errors.city.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 w-full">
                  <label
                    htmlFor=""
                    className="text-lightGray text-sm lg:text-base"
                  >
                    Address
                  </label>
                  <div className="">
                    <input
                      id="address"
                      type="text"
                      placeholder="1234 Street"
                      className={`input ${errors.address ? "!border-red" : ""}`}
                      {...register("address", {
                        required: "Please enter your address!",
                      })}
                    />
                  </div>
                  {errors.address && (
                    <p className="error">{errors.address.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <div className="space-y-2 w-full sm:w-1/2">
                    <label
                      htmlFor="zipcode"
                      className="text-lightGray text-sm lg:text-base"
                    >
                      Zip Code
                    </label>
                    <div className="">
                      <input
                        id="zipcode"
                        type="text"
                        className={`input ${errors.zipcode ? "!border-red" : ""}`}
                        {...register("zipcode", {
                          required: "Please enter zip code!",
                          pattern: {
                            value: /^\d{4,10}$/,
                            message: "Zip code must be 4-10 digits!",
                          },
                        })}
                      />
                    </div>
                    {errors.zipcode && (
                      <p className="error">{errors.zipcode.message}</p>
                    )}
                  </div>

                  <div className="space-y-2 w-full sm:w-1/2">
                    <label
                      htmlFor="phone"
                      className="text-lightGray text-sm lg:text-base"
                    >
                      Phone
                    </label>
                    <div className="">
                      <input
                        type="tel"
                        id="phone"
                        placeholder="Should start with +"
                        className={`input ${errors.phone ? "!border-red" : ""}`}
                        {...register("phone", {
                          required: "Please enter your tel number!",
                          pattern: {
                            value: /^\+?\d{9,15}$/,
                            message: "Invalid phone number format!",
                          },
                        })}
                      />
                    </div>
                    {errors.phone && (
                      <p className="error">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="border-2 rounded-md bg-deepGray p-3 text-lightGray border-darkCharcoal space-y-3">
                  <h3 className="font-semibold text-sm lg:text-base text-softBeigeYellow">
                    ~ Cash on delivery
                  </h3>
                  <h3 className="text-sm">Pay with cash upon delivery</h3>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading || cartItems.length === 0}
                    className={`bg-goldYellow shadow-[0_0_0.2rem] shadow-goldYellow text-darkCharcoal font-cormorantSC font-semibold w-full max-w-32 lg:max-w-40 md:text-lg
                    lg:text-xl py-1 hover:bg-softBeigeYellow hover:shadow-softBeigeYellow transition-color duration-300 rounded-md
                    ${loading ? "cursor-not-allowed opacity-70" : ""}`}
                  >
                    {loading ? "Placing..." : "Place Order"}
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-4 lg:space-y-16 -order-1 lg:order-1">
              <h2 className="text-lightGray font-medium text-xl lg:text-2xl xl:text-3xl text-left">
                Order Summary
              </h2>
              <div className="lg:space-y-8 bg-deepGray p-3 lg:p-4">
                <ul className="lg:space-y-6 hidden lg:flex lg:flex-col">
                  {cartItems.map((item, i) => (
                    <li key={i}>
                      <div
                        className="flex justify-between items-center"
                        key={item._id}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={`${import.meta.env.VITE_API_URL}${item.img}`}
                              alt={item.title}
                              className="w-20 h-20 md:w-24 md:h-24 object-cover"
                            />
                            <div className="absolute -top-2 -right-3 bg-goldYellow rounded-full font-cinzel font-extrabold text-darkCharcoal text-xs px-2 pt-1.5 pb-1">
                              {item.qty}
                            </div>
                          </div>
                          <div className="">
                            <h3 className="">{item.title}</h3>
                          </div>
                        </div>
                        <span className="">
                          <strong className="text-softBeigeYellow">
                            ${(item.price * item.qty).toFixed(2)}
                          </strong>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="lg:space-y-6">
                  <hr className="hidden lg:flex" />

                  <div className="flex items-center justify-between xl:text-lg">
                    <span className="">Total</span>
                    <span className="text-softBeigeYellow">${totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Checkout;
