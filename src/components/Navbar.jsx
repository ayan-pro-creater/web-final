import React, { useState, useEffect } from "react";
import { FaRegUser } from "react-icons/fa";
import Profile from "./Profile";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Firebase configuration and initialization
const firebaseConfig = {
  apiKey: "AIzaSyChyjot4JT--PYTfbBAhdFZJYM_CsiSu3M",
  authDomain: "web-ecom-58064.firebaseapp.com",
  projectId: "web-ecom-58064",
  storageBucket: "web-ecom-58064.firebasestorage.app",
  messagingSenderId: "867317078312",
  appId: "1:867317078312:web:0a5855c69270b4db95d81d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Navbar = () => {
  const [isSticky, setSticky] = useState(false);
  const { user, loading } = useAuth(); // Assuming useAuth hook gives user info
  const [cartItems, setCartItems] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fetch cart items from Firestore
  useEffect(() => {
    if (user && user.uid) {
      const cartRef = collection(db, "cart");
      const q = query(cartRef, where("userId", "==", user.uid));

      // Real-time listener for the cart items count
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setCartItems(snapshot.size); // Count of items in the user's cart
      });

      return () => unsubscribe();
    }
  }, [user]);

  const navItems = (
    <>
      <li>
        <Link className="text-red" to="/menu">Menu</Link>
      </li>
    </>
  );

  return (
    <header className={`max-w-screen-2xl container mx-auto fixed top-0 left-0 right-0 transition-all duration-300 ease-in-out`}>
      <div className={`navbar xl:px-24 ${isSticky ? "shadow-md bg-base-100 transition-all duration-300 ease-in-out" : ""}`}>
        <div className="navbar-start">
          <Link className="btn btn-ghost text-xl" to="/">
            <span className="text-red">Food</span>Zone
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navItems}</ul>
        </div>
        <div className="navbar-end">
          {/* Cart */}
          <Link to="/cart-page">
            <label
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle mr-3 flex items-center justify-center lg:flex"
            >
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="badge badge-sm indicator-item">
                  {cartItems}
                </span>
              </div>
            </label>
          </Link>
          {/* User Profile */}
          <div>
            {user ? (
              <Profile user={user} />
            ) : (
              <Link to="/login" className="btn flex items-center gap-2 rounded-full px-6 bg-red text-white">
                <FaRegUser /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
