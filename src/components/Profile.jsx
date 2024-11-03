import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore methods
import { db } from "../firebase/firebase"; // Import your Firestore configuration

const Profile = ({ user }) => {
  const { logOut } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is admin
  const [loading, setLoading] = useState(true); // State to manage loading

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

  const handleLogout = () => {
    logOut()
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
        console.error("Logout error: ", error);
      });
  };

  if (loading) return <div>Loading...</div>; // You can show a loader here

  return (
    <div>
      <div>
        <div className="drawer drawer-end z-50">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label
              htmlFor="my-drawer-4"
              className="drawer-button btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                {user.photoURL ? (
                  <img alt="User Avatar" src={user.photoURL} />
                ) : (
                  <img
                    alt="Default Avatar"
                    src="https://i.pinimg.com/564x/b3/e5/db/b3e5db5a3bf1399f74500a6209462794.jpg"
                  />
                )}
              </div>
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-4"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content-">
              {/* Sidebar content here */}
              <li>
                <a href="/update-profile">Profile</a>
              </li>
              <li>
                <a href="/order">User Dashboard</a>
              </li>
              {/* Conditionally render Admin Dashboard link */}
              {isAdmin && (
                <li>
                  <Link to="/dashboard/manage-items">Admin Dashboard</Link>
                </li>
              )}
              <li>
                <a href="/forget-password">Forget Password</a>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
