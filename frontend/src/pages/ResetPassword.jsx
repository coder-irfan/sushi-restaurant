import React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/resetpassword/${token}`,
        {
          password: password.trim(),
        }
      );
      toast.success(res.data.message); // Password reset successfully!
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <section className="flex justify-center items-center min-h-screen py-10 px-4 md:px-10">
        <div className="">
          <div className="grid lg:grid-cols-2 items-center gap-10">
            <div className="space-y-10 lg:space-y-16">
              <h2 className="text-lightGray font-medium text-2xl lg:text-3xl xl:text-[2.5rem] text-left">
                Reset Password
              </h2>

              <form
                className="flex flex-col gap-6 lg:gap-10"
                onSubmit={handleResetPassword}
              >
                <div className="space-y-2 w-full">
                  <label className="text-lightGray text-sm lg:text-base">
                    Password
                  </label>
                  <div className="">
                    <input
                      autoFocus={true}
                      type="password"
                      className="input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-goldYellow shadow-[0_0_0.2rem] shadow-goldYellow text-darkCharcoal font-cormorantSC font-semibold w-full max-w-36 lg:max-w-44 md:text-lg
                    lg:text-xl py-1 hover:bg-softBeigeYellow hover:shadow-softBeigeYellow transition-color duration-300 rounded-md
                    ${loading ? "cursor-not-allowed opacity-70" : ""}`}
                  >
                    {loading ? "Reseting..." : "Reset Password"}
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

export default ResetPassword;
