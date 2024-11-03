import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";

const ForgetPassword = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { sendPasswordReset } = useContext(AuthContext); // Correct function name from context
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Function to handle sending the reset password email
  const onSubmit = (data) => {
    const email = data.email;

    sendPasswordReset(email)
      .then(() => {
        setSuccessMessage("A reset link has been sent to your email.");
        setTimeout(() => {
          navigate("/login"); // Navigate to login page after success
        }, 3000); // 3-second delay before navigating to the login page
      })
      .catch(() => {
        setErrorMessage("Failed to send reset link. Please try again.");
      });

    reset();
  };

  return (
    <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-20">
      <div className="mb-5">
        <form
          className="card-body"
          method="dialog"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="font-bold text-lg">Reset Password</h3>

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
            {errors.email && (
              <p className="text-red-500 text-xs italic">
                Please enter a valid email address.
              </p>
            )}
          </div>

          {/* show success or error messages */}
          {successMessage && (
            <p className="text-red-500 text-xs italic">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-500 text-xs italic">{errorMessage}</p>
          )}

          {/* submit btn */}
          <div className="form-control mt-4">
            <input
              type="submit"
              className="btn bg-red text-white w-full md:w-96 py-3"
              value="Send Reset Link"
            />
          </div>

          {/* close btn */}
          <Link to="/">
            <div className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </div>
          </Link>

          <p className="text-center my-2">
            Login with your password?
            <Link to="/login" className="underline text-red ml-1">
              Login Now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
