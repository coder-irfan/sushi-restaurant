/* import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function NotFound() {
  return (
    <>
      <section className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-darkCharcoal text-white">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center space-y-4 md:space-y-6 p-4"
        >
          <h1 className="text-[4rem] sm:text-[6rem] lg:text-[7rem] font-bold text-goldYellow animate-pulse">
            404
          </h1>

          <h2 className="text-2xl sm:text-3xl font-semibold text-white">
            Oops! Page Not Found
          </h2>

          <p className="max-w-md text-lightGray text-center">
            The page you’re looking for doesn’t exist, has been removed, or you
            might have mistyped the URL.
          </p>

          <Link
            to="/admin/dashboard"
            className="mt-4 inline-block text-sm md:text-base px-4 md:px-6 py-2 md:py-3 bg-goldYellow text-black font-semibold rounded-lg shadow-lg hover:bg-softBeigeYellow transition-colors duration-300"
          >
            Go Back Home
          </Link>
        </motion.div>

        <motion.div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => {
            const size = Math.random() * 4 + 2; // 2px to 6px
            const top = Math.random() * 100; // %
            const left = Math.random() * 100; // %
            const duration = Math.random() * 20 + 15; // 15s to 35s
            const delay = Math.random() * 10; // 0s to 10s

            return (
              <motion.div
                key={i}
                className="bg-softBeigeYellow rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  top: `${top}%`,
                  left: `${left}%`,
                  position: "absolute",
                }}
                animate={{
                  y: [0, -50, 0],
                  x: [0, 30, -30, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration,
                  delay,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </motion.div>
      </section>
    </>
  );
}

export default NotFound;
 */
