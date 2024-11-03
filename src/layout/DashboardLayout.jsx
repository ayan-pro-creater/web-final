import React, { useEffect, useState } from "react";
import { Link, Outlet, Navigate } from "react-router-dom";
import { MdDashboard, MdDashboardCustomize } from "react-icons/md";
import { FaEdit, FaLocationArrow, FaPlusCircle, FaQuestionCircle, FaRegUser, FaShoppingBag, FaUser } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore methods
import { db } from "../firebase/firebase"; // Import Firestore
import useAuth from "../hooks/useAuth";

const sharedLinks = (
    <>
        <li className="mt-3">
            <Link to="/">
                <MdDashboard /> Home
            </Link>
        </li>
        <li>
            <Link to="/menu">
                <FaShoppingBag /> Menu
            </Link>
        </li>
        <li>
            <Link to="manage-orders">
                <FaLocationArrow /> Orders Tracking
            </Link>
        </li>
    </>
);

const DashboardLayout = () => {
    const { user } = useAuth(); // Get the logged-in user from context
    const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is admin
    const [loading, setLoading] = useState(true); // State to manage loading state

    useEffect(() => {
        const fetchUserRole = async () => {
            if (user) {
                const userDocRef = doc(db, "users", user.uid); // Reference to the Firestore document
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setIsAdmin(userData.role === "admin"); // Check if the user role is admin
                } else {
                    console.log("No user data found in Firestore!");
                }
            }
            setLoading(false); // Set loading to false after fetching
        };

        fetchUserRole();
    }, [user]);

    // Redirect non-admin users
    if (loading) return <div>Loading...</div>; // You can show a loader here
    if (!isAdmin) return <Navigate to="/" />; // Redirect to home if not admin

    return (
        <div>
            <div className="drawer sm:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col sm:items-start sm:justify-start my-2">
                    <div className="flex items-center justify-between mx-4">
                        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
                            <MdDashboardCustomize />
                        </label>
                        <button className="btn rounded-full px-6 bg-red flex items-center gap-2 text-white sm:hidden">
                            <FaRegUser /> Logout
                        </button>
                    </div>
                    <div className="mt-5 md:mt-2 mx-4">
                        <Outlet />
                    </div>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                        <li>
                            <Link to="/dashboard" className="flex justify-start mb-3">
                                <span className="badge badge-primary">admin</span>
                            </Link>
                        </li>
                        <hr />
                        {/* <li className="mt-3">
                            <Link to="/dashboard">
                                <MdDashboard /> Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/manage-bookings">
                                <FaShoppingBag /> Manage Bookings
                            </Link>
                        </li> */}
                        <li>
                            <Link to="/dashboard/add-menu">
                                <FaPlusCircle />
                                Add Menu
                            </Link>
                        </li>
                        {/* <li>
                            <Link to="/dashboard/create-offer">
                                <FaPlusCircle />
                                Create Offer
                            </Link>
                        </li> */}
                        <li>
                            <Link to="/dashboard/manage-items">
                                <FaEdit /> Manage Items
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link to="/dashboard/users">
                                <FaUser /> All Users
                            </Link>
                        </li>
                        <hr />
                        {sharedLinks}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
