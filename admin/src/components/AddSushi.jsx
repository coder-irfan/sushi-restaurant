import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  FaArrowLeft,
  FaCloudUploadAlt,
  FaExclamationTriangle,
} from 'react-icons/fa';

function AddSushi() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const { token } = useAdminAuth();

  const [titleLength, setTitleLength] = useState(0);
  const [textLength, setTextLength] = useState(0);

  // States for updating a sushi
  const { id } = useParams(); // Gets sushi id from URL
  const navigate = useNavigate();
  const isEditMode = Boolean(id); // True if editing

  // For editing sushi
  useEffect(() => {
    const fetchSushi = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/sushi/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const sushi = res.data;
        reset({
          title: sushi.title || '',
          text: sushi.text || '',
          price: sushi.price || '',
        });

        setTitleLength(sushi.title?.length || 0);
        setTextLength(sushi.text?.length || 0);
      } catch (error) {
        toast.error('Failed to load sushi details!');
      }
    };
    if (isEditMode && id) fetchSushi();
  }, [id, token, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Create FormData (A smart container for sending text + files to backend in one go)
      const formData = new FormData(); // If you try to send a file (like an image), JSON can’t handle it. That’s where FormData comes in!
      formData.append('title', data.title);
      formData.append('text', data.text);
      formData.append('price', data.price);

      if (data.img?.[0]) formData.append('img', data.img[0]);
      if (data.icon?.[0]) formData.append('icon', data.icon[0]);

      const url = isEditMode
        ? `${import.meta.env.VITE_API_URL}/api/sushi/${id}`
        : `${import.meta.env.VITE_API_URL}/api/admin/add-sushi`;

      const method = isEditMode ? 'put' : 'post';

      // Send or Update via axios
      const res = await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message);
      if (!isEditMode) reset();
      else navigate('/admin/dashboard/manage-sushis');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed!');
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors) => {
    toast.error('Please fill all input fields!');
  };

  return (
    <>
      <section className="max-w-3xl mx-auto py-10 px-4 md:px-10">
        <div className="space-y-6 sm:space-y-10">
          <Link
            to={
              isEditMode ? '/admin/dashboard/manage-sushis' : '/admin/dashboard'
            }
          >
            <span className="my-2 text-lightGray font-cinzel hover:underline flex justify-start items-center gap-2 hover:text-goldYellow transition-colors duration-300">
              <FaArrowLeft className="w-3" />
              Back
            </span>
          </Link>

          <div className="">
            <div className="space-y-10 sm:space-y-14">
              <h2 className="text-lightGray font-medium text-2xl lg:text-3xl xl:text-[2.5rem]">
                Add Sushi
              </h2>

              <form
                className="flex flex-col items-start gap-4"
                onSubmit={handleSubmit(onSubmit, onError)}
              >
                <div className="space-y-2 w-full">
                  <label className="text-lightGray text-sm lg:text-base">
                    Title{' '}
                    <span className="ml-2 text-sm">
                      {titleLength} / 35 char
                    </span>
                  </label>
                  <div className="">
                    <input
                      autoFocus={true}
                      type="text"
                      maxLength={35}
                      className={`input ${errors.title ? '!border-red' : ''}`}
                      {...register('title', {
                        required: 'Please enter the title!',
                        maxLength: {
                          value: 35,
                          message: 'Should not exceed 40 characters!',
                        },
                        onChange: (e) => setTitleLength(e.target.value.length),
                      })}
                    />
                  </div>

                  {errors.title && (
                    <p className="error">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2 w-full">
                  <label className="text-lightGray text-sm lg:text-base">
                    Text{' '}
                    <span className="text-sm ml-2">
                      {textLength} / 100 char
                    </span>
                  </label>
                  <div className="">
                    <textarea
                      maxLength={100}
                      className={`input ${errors.text ? '!border-red' : ''}`}
                      {...register('text', {
                        required: 'Please enter the description!',
                        maxLength: {
                          value: 100,
                          message: 'Should not exceed 200 characters!',
                        },
                        onChange: (e) => setTextLength(e.target.value.length),
                      })}
                    />
                  </div>
                  {errors.text && (
                    <p className="error">{errors.text.message}</p>
                  )}
                </div>

                <div className="space-y-2 w-full">
                  <label className="text-lightGray text-sm lg:text-base">
                    Price
                  </label>
                  <div className="">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="9999.99"
                      className={`input ${errors.price ? '!border-red' : ''}`}
                      {...register('price', {
                        required: 'Please enter the price!',
                        min: {
                          value: 0.01,
                          message: 'Price must be at least $0.01!',
                        },
                        max: {
                          value: 9999.99,
                          message: 'Price must be below $10,000!',
                        },
                      })}
                    />
                  </div>
                  {errors.price && (
                    <p className="error">{errors.price.message}</p>
                  )}
                </div>

                <div className="w-full space-y-2 my-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2">
                    <div className="space-y-2 w-full">
                      <label className="text-lightGray text-sm lg:text-base">
                        Sushi Image
                      </label>
                      <label htmlFor="img" className="file-upload-input">
                        <FaCloudUploadAlt className="text-4xl text-lightGray mb-2" />
                        <span className="text-lightGray text-sm sm:text-base text-center">
                          Click or Drag & Drop to upload
                        </span>
                        <input
                          id="img"
                          type="file"
                          accept=".webp"
                          className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                          {...register('img', {
                            required: !isEditMode && 'Please upload the image!',
                          })}
                        />
                      </label>

                      {errors.img && (
                        <p className="error">{errors.img.message}</p>
                      )}
                    </div>

                    <div className="space-y-2 w-full">
                      <label className="text-lightGray text-sm lg:text-base">
                        Rating Icon
                      </label>
                      <label htmlFor="icon" className="file-upload-input">
                        <FaCloudUploadAlt className="text-4xl text-lightGray mb-2" />
                        <span className="text-lightGray text-sm sm:text-base text-center">
                          Click or Drag & Drop to upload
                        </span>
                        <input
                          id="icon"
                          type="file"
                          accept=".webp"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          {...register('icon', {
                            required:
                              !isEditMode && 'Please upload rating icon!',
                          })}
                        />
                      </label>
                      {errors.icon && (
                        <p className="error">{errors.icon.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="border border-yellow-400/60 bg-yellow-500/10 rounded-lg p-4 flex items-center gap-3 text-lightGray shadow-md">
                    <div className="text-yellow-400 text-xl">
                      <FaExclamationTriangle />
                    </div>
                    <div className="">
                      <h3 className="font-semibold text-softBeigeYellow text-sm lg:text-base">
                        Important Upload Rules!
                      </h3>
                      <p className="text-sm mt-1 text-lightGray">
                        Only{' '}
                        <span className="font-semibold text-softBeigeYellow">
                          .webp
                        </span>{' '}
                        image format is allowed to ensure fast loading and
                        smaller file size.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full flex flex-wrap gap-4 items-center justify-center sm:justify-start">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-goldYellow shadow-[0_0_0.2rem] shadow-goldYellow text-darkCharcoal font-cormorantSC font-semibold w-full max-w-32 lg:max-w-40 md:text-lg
                    lg:text-xl py-1 hover:bg-softBeigeYellow hover:shadow-softBeigeYellow transition-color duration-300 rounded-md
                    ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
                  >
                    {loading
                      ? isEditMode
                        ? 'Updating...'
                        : 'Adding...'
                      : isEditMode
                        ? 'Update Sushi'
                        : 'Add Sushi'}
                  </button>

                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => navigate('/admin/dashboard/manage-sushis')}
                      className="flex text-red px-3 py-1 border border-red rounded-md lg:text-lg
                      transition-colors duration-300 font-bold items-center gap-1 font-cormorantSC"
                    >
                      Cancle
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AddSushi;
