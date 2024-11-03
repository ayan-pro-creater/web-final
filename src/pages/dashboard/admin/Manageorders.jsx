import React, { useEffect, useState } from "react";
import { db } from "../../../firebase/firebase"; // Adjust the import based on your Firebase config
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { GiConfirmed } from "react-icons/gi";
import { MdCancel } from "react-icons/md";
import { BsFillCheckCircleFill } from "react-icons/bs";
import Swal from "sweetalert2";

const ManageBookings = () => {
    const [orders, setOrders] = useState([]);

    // Fetch orders from Firebase
    const fetchOrders = async () => {
        const ordersCollection = collection(db, "orders"); // Replace "orders" with your collection name
        const orderSnapshot = await getDocs(ordersCollection);
        const orderList = orderSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setOrders(orderList);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleConfirm = async (item) => {
        const orderRef = doc(db, "orders", item.id);
        await updateDoc(orderRef, { status: "confirmed" });
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Order Confirmed",
            showConfirmButton: false,
            timer: 1500,
        });
        fetchOrders();
    };

    const handleCancel = async (item) => {
        const orderRef = doc(db, "orders", item.id);
        await updateDoc(orderRef, { status: "canceled" });
        Swal.fire({
            position: "top-end",
            icon: "info",
            title: "Order Canceled",
            showConfirmButton: false,
            timer: 1500,
        });
        fetchOrders();
    };

    const handleDeliver = async (item) => {
        const orderRef = doc(db, "orders", item.id);
        await updateDoc(orderRef, { status: "delivered" });
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Order Delivered",
            showConfirmButton: false,
            timer: 1500,
        });
        fetchOrders();
    };

    const handleDeleteOrder = async (item) => {
        const orderRef = doc(db, "orders", item.id);
        await deleteDoc(orderRef);
        Swal.fire({
            title: "Deleted!",
            text: `${item.id} has been removed from the database.`,
            icon: "success",
            confirmButtonText: "OK",
        });
        fetchOrders();
    };

    return (
        <div>
            <div className="flex items-center justify-between m-4">
                <h5>All Orders</h5>
                <h5>Total Orders: {orders.length}</h5>
            </div>

            {/* Table */}
            <div>
                <div className="overflow-x-auto">
                    <table className="table table-zebra md:w-[870px]">
                        {/* Head */}
                        <thead className="bg-red text-white rounded-lg">
                            <tr>
                                <th>#</th>
                                <th>User Email</th>
                                <th>Transaction Id</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Confirm Order</th>
                                <th>Cancel Order</th>
                                <th>Deliver Order</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((item, index) => (
                                <tr key={item.id}>
                                    <th>{index + 1}</th>
                                    <td>{item.email || "N/A"}</td>
                                    <td>{item.transactionId || "N/A"}</td>
                                    <td>${item.price || "N/A"}</td>
                                    <td>{item.status}</td>
                                    <td className="text-center">
                                        {item.status === "confirmed" ? (
                                            "Confirmed"
                                        ) : (
                                            <button
                                                onClick={() => handleConfirm(item)}
                                                className="btn btn-xs bg-red text-white"
                                            >
                                                <GiConfirmed />
                                            </button>
                                        )}
                                    </td>
                                    <td className="text-center">
                                        {item.status === "canceled" ? (
                                            "Canceled"
                                        ) : (
                                            <button
                                                onClick={() => handleCancel(item)}
                                                className="btn btn-xs bg-red text-white"
                                            >
                                                <MdCancel />
                                            </button>
                                        )}
                                    </td>
                                    <td className="text-center">
                                        {item.status === "delivered" ? (
                                            "Delivered"
                                        ) : (
                                            <button
                                                onClick={() => handleDeliver(item)}
                                                className="btn btn-xs bg-primary text-white"
                                            >
                                                <BsFillCheckCircleFill />
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-xs bg-light text-white"
                                            onClick={() => handleDeleteOrder(item)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageBookings;
