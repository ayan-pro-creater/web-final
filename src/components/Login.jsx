import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import { db } from "../firebase/firebase"; // Import Firestore
import { doc, getDoc } from "firebase/firestore"; // Import Firestore methods
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS for styling

const Login = () => {
  const { login } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // State for storing Firestore user data

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const email = data.email;
    const password = data.password;

    try {
      const result = await login(email, password);
      const user = result.user;

      // Show success toast notification
      toast.success("Login Successful");
      setIsLoggedIn(true);

      // Fetch user data from Firestore
      const userDocRef = doc(db, "users", user.uid); // Adjust collection name if necessary
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserData(userDoc.data()); // Store Firestore data in state
      } else {
        console.log("No user data found in Firestore!");
      }
    } catch (error) {
      setErrorMessage("Please provide valid email & password!");
      // Show error toast notification
      toast.error("Login failed. Please check your credentials.");
    }
  };

  // Redirect to the homepage if login is successful
  if (isLoggedIn) {
    return <Navigate to="/menu" />;
  }

  return (
    <div>
      <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-20">
        <div className="mb-5">
          <form
            className="card-body"
            method="dialog"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3 className="font-bold text-lg">Please Login!</h3>

            {/* email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter Your Email"
                className="input input-bordered"
                {...register("email")}
              />
            </div>

            {/* password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter Your Password"
                className="input input-bordered"
                {...register("password", { required: true })}
              />
              <label className="label">
                <a
                  href="/forget-password"
                  className="label-text-alt link link-hover mt-2"
                >
                  Forgot password?
                </a>
              </label>
            </div>

            {/* show errors */}
            {errorMessage && (
              <p className="text-red text-xs italic">{errorMessage}</p>
            )}

            {/* submit btn */}
            <div className="form-control mt-4">
              <input
                type="submit"
                className="btn bg-red text-white w-full md:w-96 py-3"
                value="Login"
              />
            </div>
            <p className="text-center my-2">
              Don’t have an account?
              <Link to="/register" className="underline text-red ml-1">
                Register Now
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Display user data if available */}
      {userData && (
        <div className="text-center mt-4">
          <h2>Welcome, {userData.name}!</h2>
          <p>Your role: {userData.role}</p> {/* Display the user's role */}
        </div>
      )}
    </div>
  );
};

export default Login;
