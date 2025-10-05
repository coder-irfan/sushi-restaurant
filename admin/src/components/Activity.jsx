import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function Activity() {
  return (
    <>
      <section className="">
        <div className="space-y-6 sm:space-y-10">
          <Link to="/admin/dashboard">
            <span className="my-2 text-lightGray font-cinzel hover:underline flex justify-start items-center gap-2 hover:text-goldYellow transition-colors duration-300">
              <FaArrowLeft className="w-3" />
              Back
            </span>
          </Link>

          <div className="space-y-6 sm:space-y-10 xl:space-y-14">
            <h2 className="text-lightGray font-medium text-2xl lg:text-3xl xl:text-[2.5rem]">Activity</h2>

            
          </div>
        </div>
        
      </section>
    </>
  )
}

export default Activity;