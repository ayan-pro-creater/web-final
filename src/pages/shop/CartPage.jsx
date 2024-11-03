import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { collection, getDocs, doc, deleteDoc, addDoc } from "firebase/firestore";

const CartPage = () => {
    const { user } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const cartCollectionRef = collection(db, "cart");
                const querySnapshot = await getDocs(cartCollectionRef);

                const userCartItems = [];
                querySnapshot.forEach((doc) => {
                    const itemData = doc.data();
                    if (itemData.userId === user?.uid) {
                        userCartItems.push({ ...itemData, id: doc.id });
                    }
                });
                setCartItems(userCartItems);
                calculateTotalAmount(userCartItems);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };

        fetchCartItems();
    }, [user]);

    const calculateTotalAmount = (items) => {
        const total = items.reduce((acc, item) => acc + item.price, 0);
        setTotalAmount(total);
    };

    const handleDelete = async (item) => {
        const itemRef = doc(db, "cart", item.id);
        await deleteDoc(itemRef);
        setCartItems((prev) => prev.filter((cartItem) => cartItem.id !== item.id));
        calculateTotalAmount(cartItems);
        Swal.fire("Deleted!", "Your item has been deleted.", "success");
    };

    const handleCheckout = async () => {
        try {
            const orderData = {
                userId: user?.uid,
                userName: user?.displayName || "None",
                userEmail: user?.email,
                items: cartItems,
                totalAmount,
                status: "Pending", // Default order status
                createdAt: new Date().toISOString(),
            };

            // Add the order to the "orders" collection
            await addDoc(collection(db, "orders"), orderData);

            // Optionally clear the cart after order is placed
            for (const item of cartItems) {
                await deleteDoc(doc(db, "cart", item.id));
            }
            setCartItems([]); // Clear cart items in the state

            Swal.fire("Success!", "Your order has been placed!", "success");
            navigate("/order"); // Redirect to order confirmation or other page
        } catch (error) {
            console.error("Error placing order:", error);
            Swal.fire("Error", "There was an error placing your order. Please try again.", "error");
        }
    };

    return (
        <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
            {/* Banner */}
            <div className="">
                <div className="py-28 flex flex-col items-center justify-center">
                    <div className="text-center px-4 space-y-7">
                        <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
                            Items Added to The<span className="text-red"> Cart</span>
                        </h2>
                    </div>
                </div>
            </div>

            {/* Cart Table */}
            {cartItems.length > 0 ? (
                <div>
                    <div className="">
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead className="bg-red text-white rounded-sm">
                                    <tr>
                                        <th>ID</th>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.id}</td>
                                            <td>
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <img src={item.image} alt={item.name} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="font-medium">{item.name}</td>
                                            <td>{item.category}</td>
                                            <td>${item.price.toFixed(2)}</td>
                                            <td>
                                                <button className="btn btn-sm border-none text-red bg-transparent" onClick={() => handleDelete(item)}>
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <hr />
                    <div className="flex flex-col md:flex-row justify-between items-start my-12 gap-8">
                        <div className="md:w-1/2 space-y-3">
                            <h3 className="text-lg font-semibold">Customer Details</h3>
                            <p>Name: {user?.displayName || "None"}</p>
                            <p>Email: {user?.email}</p>
                            <p>User ID: <span className="text-sm">{user?.uid}</span></p>
                        </div>
                        <div className="md:w-1/2 space-y-3">
                            <h3 className="text-lg font-semibold">Shopping Details</h3>
                            <p>Total Items: {cartItems.length}</p>
                            <p>Total Amount: ${totalAmount.toFixed(2)}</p>
                            <button
                                className="btn btn-md bg-red text-white px-8 py-1 mt-5"
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center mt-20">
                    <p>Cart is empty. Please add products.</p>
                    <Link to="/menu">
                        <button className="btn bg-red text-white mt-3">Back to Menu</button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CartPage;
