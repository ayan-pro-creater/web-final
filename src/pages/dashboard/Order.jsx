import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { Link } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

const Order = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (user?.uid) {
                try {
                    const ordersCollectionRef = collection(db, "orders");
                    const querySnapshot = await getDocs(ordersCollectionRef);

                    const userOrders = querySnapshot.docs
                        .map((doc) => ({ ...doc.data(), id: doc.id }))
                        .filter((order) => order.userId === user.uid);

                    setOrders(userOrders);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                }
            }
        };

        fetchOrders();
    }, [user]);

    const formatDate = (createdAt) => {
        const createdAtDate = new Date(createdAt);
        return createdAtDate.toLocaleDateString();
    };

    return (
        <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
            {/* Banner */}
            <div className="py-28 flex flex-col items-center justify-center">
                <div className="text-center px-4 space-y-7">
                    <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
                        Track All Your<span className="text-red"> Orders</span>
                    </h2>
                </div>
            </div>

            {/* Orders Table */}
            <div>
                {orders.length > 0 ? (
                    <div>
                        <div className="overflow-x-auto">
                            <table className="table">
                                {/* Table Head */}
                                <thead className="bg-red text-white rounded-sm">
                                    <tr>
                                        <th>#</th>
                                        <th>Order Date</th>
                                        {/* <th>Transaction ID</th> */}
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{formatDate(item.createdAt)}</td>
                                            {/* <td className="font-medium">{item.transactionId}</td> */}
                                            <td>${item.totalAmount}</td>
                                            <td>{item.status}</td>
                                            <td>
                                                <Link to="/contact-us" className="btn btn-sm border-none text-red bg-transparent">
                                                    Contact Us
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center mt-20">
                        <p>No orders found. Please add products to cart and check out.</p>
                        <Link to="/menu">
                            <button className="btn bg-red text-white mt-3">Back to Menu</button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Order;
