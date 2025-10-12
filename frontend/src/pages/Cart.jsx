import React from "react";
import {
  FaTimes,
  FaShoppingBag,
  FaTrash,
  FaShoppingCart,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Cart({
  cartItems,
  setCartItems,
  isCartOpen,
  setIsCartOpen,
  increase,
  decrease,
}) {
  const totalItems = cartItems.length;
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const tax = 10;
  const totalWithTax = totalAmount + tax;

  const handleRemoveItem = (_id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== _id)); // filter loops through each item and for each item, it keeps it only if item._id !== _id
  };

  return (
    <>
      <section className="">
        <div
          className={`fixed top-0 right-0 h-full w-5/6 sm:w-2/3 md:w-2/4 lg:w-2/5 xl:w-1/3 transition-all duration-700 bg-deepGray overflow-y-auto z-[100]
          ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-6 md:p-8">
            <div className="flex items-center gap-3 text-goldYellow">
              <FaShoppingBag className="w-5 h-5" />
              <div className="flex items-center gap-1">
                <p className="">Items</p>
                <span>({totalItems})</span>
              </div>
            </div>

            {isCartOpen && (
              <div className="" onClick={() => setIsCartOpen(false)}>
                <FaTimes className="cursor-pointer w-5 h-5 text-goldYellow" />
              </div>
            )}
          </div>

          <hr className="border border-goldYellow" />

          <div className="">
            {cartItems.length === 0 ? (
              <div className="flex justify-center items-center pt-72">
                <p className="text-goldYellow">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="p-4 md:p-6 space-y-10 md:space-y-16">
                  <div className="space-y-4 lg:space-y-6">
                    {cartItems.map((item) => (
                      <div
                        className="flex justify-between items-center"
                        key={item._id}
                      >
                        <div className="flex items-center gap-4">
                          <div className="">
                            <img
                              src={`${import.meta.env.VITE_API_URL}${item.img}`}
                              alt={item.title}
                              className="w-20 h-20 md:w-24 md:h-24 object-cover"
                            />
                          </div>
                          <div className="space-y-3">
                            <div className="">
                              <h3 className="">{item.title}</h3>

                              <span className="text-sm">
                                ${item.price} x {item.qty} ={" "}
                                <strong className="text-softBeigeYellow">
                                  ${item.price * item.qty}
                                </strong>
                              </span>
                            </div>

                            <div className="flex items-center justify-around bg-softBeigeYellow px-1 py-0.5 rounded-full w-20">
                              <img
                                src="images/minus-icon.webp"
                                alt="minus"
                                className="w-3 brightness-0 cursor-pointer"
                                onClick={() => decrease(item._id)}
                              />

                              <span className="text-darkCharcoal font-bold font-cinzel text-sm">
                                {cartItems.find((i) => i._id === item._id)?.qty}
                              </span>

                              <img
                                src="images/plus-icon.webp"
                                alt="plus"
                                className="w-3 brightness-0 cursor-pointer"
                                onClick={() => increase(item)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="">
                          <FaTrash
                            className="cursor-pointer hover:text-goldYellow transition-colors duration-300"
                            onClick={() => handleRemoveItem(item._id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 md:p-6 bg-darkCharcoal rounded-sm">
                    <div className="space-y-3 md:space-y-4">
                      <h4 className="text-lg md:text-xl text-softBeigeYellow font-semibold">
                        Summary
                      </h4>

                      <hr />

                      <div className="space-y-1 md:space-y-2">
                        <div className="flex items-center justify-between text-xs md:text-sm">
                          <span className="">Subtotal</span>
                          <span className="text-softBeigeYellow">
                            ${totalAmount}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs md:text-sm">
                          <span className="">Tax</span>
                          <span className="text-softBeigeYellow">$10</span>
                        </div>
                      </div>

                      <hr />

                      <div className="flex items-center justify-between">
                        <h5 className="">
                          Total <span className="text-xs">incl.tax</span>{" "}
                        </h5>
                        <span className="text-sm md:text-base text-softBeigeYellow font-semibold">
                          ${totalWithTax}
                        </span>
                      </div>

                      <Link to="/checkout" state={{ cartItems }}>
                        <div className="flex items-center justify-center pt-6 md:pt-4">
                          <button
                            className="bg-goldYellow uppercase shadow-[0_0_0.2rem] shadow-goldYellow text-darkCharcoal font-cormorantSC font-semibold px-4 py-2 md:text-lg
                            hover:bg-softBeigeYellow hover:shadow-softBeigeYellow transition-color duration-300 flex items-center justify-center gap-2 w-full"
                          >
                            <FaShoppingCart />
                            Checkout
                          </button>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Cart;
