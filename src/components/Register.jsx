import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import { db } from "../firebase/firebase"; // Import Firestore instance
import { doc, setDoc } from "firebase/firestore"; // Import Firestore methods
import { toast } from "react-toastify"; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS

const Register = () => {
  const { createUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const name = data.name;
    const email = data.email;
    const password = data.password;

    createUser(email, password)
      .then(async (result) => {
        const user = result.user;
        // Show success toast
        toast.success("Registration Successful");

        // Save user data to Firestore with default role
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: email,
          role: "user", // Set default role
          createdAt: new Date().toISOString(), // Optional timestamp
        });

        setIsRegistered(true);
      })
      .catch((error) => {
        setErrorMessage("Please provide valid email & password!");
        // Show error toast
        toast.error("Please provide valid email & password!");
      });
  };

  // Redirect to the login page if registration is successful
  if (isRegistered) {
    return <Navigate to="/login" />;
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
            <h1 className="font-bold text-lg text-center">
              Please Create An Account!
            </h1>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="name"
                placeholder="Enter Your Name"
                className="input input-bordered"
                {...register("name", { required: true })}
              />
            </div>

            {/* email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter Your Email"
                className="input input-bordered"
                {...register("email", { required: true })}
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

            {/* submit btn */}
            <div className="form-control mt-4">
              <input
                type="submit"
                className="btn bg-red text-white w-full md:w-96 py-3"
                value="Register"
              />
            </div>

            <p className="text-center my-2">
              Already have an account?
              <Link to="/login" className="underline text-red ml-1">
                Login Now
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
