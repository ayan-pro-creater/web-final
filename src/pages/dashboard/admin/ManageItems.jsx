import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

const ManageItems = () => {
    const [menu, setMenu] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);

    // Fetch Menu Data from Firestore
    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "menu"));
                const data = querySnapshot.docs.map((doc) => ({
                    _id: doc.id,
                    ...doc.data(),
                }));
                setMenu(data);
            } catch (error) {
                console.error("Error fetching menu items:", error);
            }
        };
        fetchMenuItems();
    }, []);

    // Handle Delete Item
    const handleDeleteItem = async (item) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This item will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteDoc(doc(db, "menu", item._id));
                    setMenu((prevMenu) => prevMenu.filter((menuItem) => menuItem._id !== item._id));
                    Swal.fire("Deleted!", "The item has been deleted.", "success");
                } catch (error) {
                    Swal.fire("Error", "Something went wrong while deleting.", "error");
                    console.error("Error deleting item:", error);
                }
            }
        });
    };

    // Open Edit Modal
    const openEditModal = (item) => {
        setEditItem({ ...item, price: parseFloat(item.price) || 0 });
        setIsEditModalOpen(true);
    };

    // Close Edit Modal
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditItem(null);
    };

    // Handle Save Changes
    const handleSaveChanges = async (e) => {
        e.preventDefault();
        if (!editItem) return;

        try {
            const itemDoc = doc(db, "menu", editItem._id);
            await updateDoc(itemDoc, {
                name: editItem.name,
                price: editItem.price,
                image: editItem.image,
                recipe: editItem.recipe,
            });
            setMenu((prevMenu) =>
                prevMenu.map((menuItem) => (menuItem._id === editItem._id ? editItem : menuItem))
            );
            closeEditModal();
            Swal.fire("Updated!", "The item has been updated.", "success");
        } catch (error) {
            Swal.fire("Error", "Something went wrong while updating.", "error");
            console.error("Error updating item:", error);
        }
    };

    // Handle Input Change in Edit Form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditItem({ ...editItem, [name]: name === "price" ? parseFloat(value) || 0 : value });
    };

    return (
        <div className="w-full md:w-[870px] px-4 mx-auto my-8">
            <h2 className="text-2xl font-semibold my-4">
                Manage All <span className="text-red-600">Menu Items</span>
            </h2>

            {/* Menu Item Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-left">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-3">#</th>
                                <th className="p-3">Image</th>
                                <th className="p-3">Item Name</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">Edit</th>
                                <th className="p-3">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menu.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="p-3 text-center">{index + 1}</td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12">
                                                <img src={item.image} alt={item.name} className="object-cover w-full h-full rounded-md" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">{item.name}</td>
                                    <td className="p-3">${parseFloat(item.price).toFixed(2)}</td>
                                    <td className="p-3">
                                        <button onClick={() => openEditModal(item)} className="p-2 rounded-md bg-red text-white">
                                            <FaEdit />
                                        </button>
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleDeleteItem(item)}
                                            className="p-2 rounded-md bg-red text-white"
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

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-xl font-semibold mb-4">Edit Menu Item</h3>
                        <form onSubmit={handleSaveChanges}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Item Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editItem.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={editItem.price}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={editItem.image}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">recipe</label>
                                <textarea
                                    name="recipe"
                                    value={editItem.recipe}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={closeEditModal} className="p-2 bg-gray rounded-md">
                                    Cancel
                                </button>
                                <button type="submit" className="p-2 bg-red text-white rounded-md">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageItems;
