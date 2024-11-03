import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase"; // Adjust this import based on your Firebase setup
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth, deleteUser } from "firebase/auth"; // Import Firebase Auth
import { FaTrashAlt, FaUsers } from "react-icons/fa";
import Swal from "sweetalert2"; // Import SweetAlert2

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch users from Firestore
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, "users");
                const userSnapshot = await getDocs(usersCollection);
                const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(userList);
            } catch (err) {
                setError("Failed to fetch users. Please try again later.");
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Promote a user to admin or revoke admin rights
    const handleToggleAdmin = async (user) => {
        const newRole = user.role === "admin" ? "user" : "admin";
        try {
            const userRef = doc(db, "users", user.id);
            await updateDoc(userRef, { role: newRole });
            Swal.fire({
                icon: 'success',
                title: `${user.name} is now a ${newRole}`,
            });
            fetchUsers(); // Re-fetch users after updating
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Failed to update user role. Please try again.",
            });
            console.error("Error toggling role:", error);
        }
    };

    // Delete a user from Firestore and Authentication
    const handleDeleteUser = async (user) => {
        const confirmDelete = await Swal.fire({
            title: `Are you sure you want to delete ${user.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (confirmDelete.isConfirmed) {
            const auth = getAuth();
            try {
                // Get user from Firebase Auth
                const firebaseUser = auth.currentUser;
                if (firebaseUser) {
                    // If the user to delete is the currently logged in user
                    if (firebaseUser.uid === user.id) {
                        await deleteUser(firebaseUser); // Delete from Firebase Auth
                    }
                }

                // Delete user from Firestore
                const userRef = doc(db, "users", user.id);
                await deleteDoc(userRef);
                Swal.fire({
                    icon: 'success',
                    title: `${user.name} has been removed from the database`,
                });
                fetchUsers(); // Re-fetch users after deletion
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: "Failed to delete user. Please try again.",
                });
                console.error("Error deleting user:", error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div className="flex items-center justify-between m-4">
                <h5 className="text-lg font-semibold">All Users</h5>
                <h5>Total Users: {users.length}</h5>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full md:w-[1200px] lg:w-[1400px]">
                    {/* Head */}
                    <thead className="bg-red text-white rounded-lg">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id}>
                                <th>{index + 1}</th>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button
                                        onClick={() => handleToggleAdmin(user)}
                                        className={`btn btn-xs ${user.role === "admin" ? "bg-red-500" : "bg-indigo-500"} text-white`}
                                    >
                                        {user.role === "admin" ? "Revoke Admin" : "Make Admin"}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDeleteUser(user)}
                                        className="btn btn-xs bg-red-500 text-white"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
