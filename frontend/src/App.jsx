import React from "react";
import { useState, useEffect, Suspense, lazy } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SpecialMenu from "./components/SpecialMenu";
import ImageDivider from "./components/ImageDivider";
import Specialities from "./components/Specialities";
import Recipe from "./components/Recipe";
import DiningEvents from "./components/DiningEvents";
import ImageDivider2 from "./components/ImageDivider2";
import OurStory from "./components/OurStory";
import Footer from "./components/Footer";
import { Routes, Route, useLocation } from "react-router-dom";
const SignUp = lazy(() => import ('./pages/SignUp'));
const LogIn = lazy(() => import ('./pages/LogIn'));
const ForgotPassword = lazy(() => import ('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import ('./pages/ResetPassword'));
const CheckEmail = lazy(() => import ('./pages/CheckEmail'));
const VerifyEmail = lazy(() => import ('./pages/VerifyEmail'));
const Checkout = lazy(() => import ('./pages/Checkout'));
const OrderSuccess = lazy(() => import ('./pages/SuccessOrder'));
const Reservation = lazy(() => import ('./pages/Reservation'));
const BookingSuccess = lazy(() => import ('./pages/SuccessBooking'));
import MyOrder from "./pages/MyOrder";
import MyBooking from "./pages/MyBooking";
import Cart from "./pages/Cart";
import { useAuth } from "./contexts/AuthContext";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Loader from "./pages/Loader";

function App() {

  /* NAVBAR */
  const [scrolled, setScrolled] = useState(false);

  const changeNavBar = () => {
    if (window.scrollY >= 80) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', changeNavBar);
    return () => {
      window.removeEventListener('scroll', changeNavBar);
    };
  }, []);


  /* LOCATION */
  const location = useLocation();
  const hideLayoutsPaths = ["/login", "/signup", "/forgotpassword", "/check-email", "/checkout", "/order-success", "/myorder", "/reservation", "/reservation-success", "/mybooking" ];
  const shouldHideLayout = 
    hideLayoutsPaths.includes(location.pathname) ||
    location.pathname.startsWith("/resetpassword/") || /* These twos are dynamic */
    location.pathname.startsWith("/verify/");


  /* Add To Cart */
  const [cartItems, setCartItems] = useState([]);


  // Cart Open
  const [isCartOpen, setIsCartOpen] = useState(false);


  // Store items in localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);


  // Increase button for adding item
  const increase = (sushi) => {
    setCartItems(prevCart => {
      const itemInCart = prevCart.find(item => item._id === sushi._id);

      if (itemInCart) {
        return prevCart.map(item => 
          item._id === sushi._id ? { ...item, qty: item.qty + 1 } : item,
        );
      } else {
        return [...prevCart, {...sushi, qty: 1 }];
      }
    });
    toast.success("Added to cart", {
      position: "top-right",
      autoClose: 2000,
      className: "my-toast",
      bodyClassName: "my-toast-body", 
    });
  }

  // Decrease button for removing item
  const decrease = (id) => {
    setCartItems(prevCart => {
      return prevCart.map(item => 
        item._id === id ? {...item, qty: item.qty - 1} : item
      )
      .filter(item => item.qty > 0)
    });

    toast.error("Removed from cart", {
      position: "top-right",
      autoClose: 2000,
      className: "my-toast",
      bodyClassName: "my-toast-body", 
    });
  }

  // Loading when user logged in
  const { loading } = useAuth();

  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <>
      <div className="">
        {!shouldHideLayout && (
          <>
            <div className="bg-hero-pattern bg-deepGray bg-cover bg-no-repeat bg-center relative">
              <Header scrolled={scrolled} cartItems={cartItems} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
              <Hero />
              <div className="absolute z-0 bottom-0 left-0 right-0 h-full bg-darkCharcoal bg-opacity-55 md:bg-opacity-40" />
            </div>

            <SpecialMenu cartItems={cartItems} setCartItems={setCartItems} decrease={decrease} increase={increase} />
            <ImageDivider />
            <Specialities />
            <Recipe />
            <DiningEvents />
            <ImageDivider2 />
            <OurStory />
            <Footer />
            <Cart cartItems={cartItems} setCartItems={setCartItems} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} decrease={decrease} increase={increase} />
          </>
        )}

        <Routes>
          <Route path='/signup' element={<Suspense fallback={<Loader />}> <SignUp /> </Suspense>} />
          <Route path='/login' element={<Suspense fallback={<Loader />}> <LogIn /> </Suspense>} />
          <Route path='/forgotpassword' element={<Suspense fallback={<Loader />}> <ForgotPassword /> </Suspense>} />
          <Route path='/resetpassword/:token' element={<Suspense fallback={<Loader />}> <ResetPassword /> </Suspense>} />
          <Route path='/verify/:token' element={<Suspense fallback={<Loader />}> <VerifyEmail /> </Suspense>} />
          <Route path='/check-email' element={<Suspense fallback={<Loader />}> <CheckEmail /> </Suspense>} />
          <Route path='/checkout' element={<Suspense fallback={<Loader />}> <Checkout setCartItems={setCartItems} /> </Suspense>} />
          <Route path='/order-success' element={<Suspense fallback={<Loader />}> <OrderSuccess /> </Suspense>} />
          <Route path='/myorder' element={ <MyOrder /> } />
          <Route path='/reservation' element={<Suspense fallback={<Loader />}> <Reservation /> </Suspense>} />
          <Route path='/reservation-success' element={<Suspense fallback={<Loader />}> <BookingSuccess /> </Suspense>} />
          <Route path='/mybooking' element={ <MyBooking /> } />
        </Routes>

        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false} // shows the progress bar that counts down until the toast closes
          newestOnTop={false} // new toasts appear below existing ones
          closeOnClick
          rtl={false} // For other languages like Arabic or Persian we set left to right to true
          pauseOnFocusLoss
          draggable
          pauseOnHover
          transition={Slide}
        />
        
      </div>
    </>
  )
}

export default App;