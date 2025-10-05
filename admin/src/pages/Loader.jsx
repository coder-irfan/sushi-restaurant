import React from "react";

function Loader() {
  return (
    <>
      <div className="flex justify-center items-center min-h-screen gap-2 md:gap-3">
        <span className="text-lightGray text-lg md:text-xl lg:text-2xl xl:text-3xl text-center">Loading</span>
        <div className="flex justify-center items-center gap-1 md:gap-2">
          <div className="w-2 h-2 bg-goldYellow rounded-full animate-bounce1"></div>
          <div className="w-2 h-2 bg-goldYellow rounded-full animate-bounce2"></div>
          <div className="w-2 h-2 bg-goldYellow rounded-full animate-bounce3"></div>
        </div>
      </div>
    </>
  )
}

export default Loader;
  