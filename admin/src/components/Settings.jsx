import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAdminAuth } from '../context/AdminAuthContext';
import axios from 'axios';

function Settings() {
  const { admin, token, updateAdmin } = useAdminAuth();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!token) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/settings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setValue('name', res.data.name);
        setValue('email', res.data.email);
      } catch (error) {
        toast.error('Failed to load admin info!');
      }
    };
    fetchAdminData();
  }, [token, setValue]);

  const onSubmit = async (data) => {
    if (data.newPassword && data.currentPassword === data.newPassword) {
      toast.error('New password cannot be the same as your current password!');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/settings`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      reset({ currentPassword: '', newPassword: '' });
      if (res.data.admin) updateAdmin(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed!');
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors) => {
    toast.error('Please fill all input fields!');
  };

  return (
    <>
      <section className="flex justify-center items-center min-h-screen py-10 px-4 md:px-10">
        <div className="max-w-6xl mx-auto relative">
          <Link to="/admin/dashboard">
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
                Admin Settings
              </h2>

              <form
                className="flex flex-col gap-4"
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit, onError)}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="space-y-2 w-full sm:w-1/2">
                    <label className="text-lightGray text-sm lg:text-base">
                      Name
                    </label>
                    <div className="">
                      <input
                        autoFocus={true}
                        type="text"
                        className={`input ${errors.name ? '!border-red' : ''}`}
                        {...register('name', {
                          required: 'Please enter your name!',
                        })}
                      />
                    </div>
                    {errors.name && (
                      <p className="error">{errors.name.message}</p>
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
                        className={`input ${errors.email ? '!border-red' : ''}`}
                        {...register('email', {
                          required: 'Please enter your email!',
                          pattern: {
                            value:
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Please enter a valid email!',
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
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      autoComplete="off"
                      className={`input ${errors.currentPassword ? '!border-red' : ''}`}
                      {...register('currentPassword', {
                        required: 'Please enter your current password!',
                      })}
                    />
                    <span
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-4"
                    >
                      {showCurrent ? (
                        <FaEye className="w-4 lg:w-6 text-goldYellow" />
                      ) : (
                        <FaEyeSlash className="w-4 lg:w-6 text-goldYellow" />
                      )}
                    </span>
                  </div>
                  {errors.currentPassword && (
                    <p className="error">{errors.currentPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2 w-full">
                  <label className="text-lightGray text-sm lg:text-base">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      className={`input ${errors.newPassword ? '!border-red' : ''}`}
                      autoComplete="off"
                      {...register('newPassword', {
                        required: 'Please add your new password!',
                      })}
                    />
                    <span
                      onClick={() => setShowNew(!showNew)}
                      className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-4"
                    >
                      {showNew ? (
                        <FaEye className="w-4 lg:w-6 text-goldYellow" />
                      ) : (
                        <FaEyeSlash className="w-4 lg:w-6 text-goldYellow" />
                      )}
                    </span>
                  </div>
                  {errors.newPassword && (
                    <p className="error">{errors.newPassword.message}</p>
                  )}
                </div>

                <div className="">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-goldYellow shadow-[0_0_0.2rem] shadow-goldYellow text-darkCharcoal font-cormorantSC font-semibold w-full max-w-28 lg:max-w-40 md:text-lg
                    lg:text-xl py-1 hover:bg-softBeigeYellow hover:shadow-softBeigeYellow transition-color duration-300 rounded-md
                    ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </button>
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
  );
}

export default Settings;
