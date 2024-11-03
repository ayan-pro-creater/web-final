import React, { useEffect, useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert
import { FaFilter } from "react-icons/fa";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import useAuth from "../../hooks/useAuth";

const Menu = () => {
    const [menu, setMenu] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortOption, setSortOption] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "menu"));
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMenu(data);
                setFilteredItems(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const addToCart = async (item) => {
        if (!user) {
            Swal.fire("Please log in to add items to the cart.");
            return;
        }

        const cartRef = collection(db, "cart");
        const cartQuery = query(cartRef, where("userId", "==", user.uid), where("id", "==", item.id));

        try {
            const querySnapshot = await getDocs(cartQuery);

            if (!querySnapshot.empty) {
                Swal.fire("Item already in cart!", "You have already added this item to your cart.", "info");
            } else {
                await addDoc(cartRef, {
                    ...item,
                    userId: user.uid,
                });
                Swal.fire("Added!", "Item added to cart successfully.", "success");
            }
        } catch (error) {
            console.error("Error adding item to cart:", error);
            Swal.fire("Error", "Could not add item to cart. Try again later.", "error");
        }
    };

    const filterItems = (category) => {
        const filtered = category === "all" ? menu : menu.filter((item) => item.category === category);
        setFilteredItems(filtered);
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const showAll = () => {
        setFilteredItems(menu);
        setSelectedCategory("all");
        setCurrentPage(1);
    };

    const handleSortChange = (option) => {
        setSortOption(option);
        let sortedItems = [...filteredItems];

        switch (option) {
            case "A-Z":
                sortedItems.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "Z-A":
                sortedItems.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "low-to-high":
                sortedItems.sort((a, b) => a.price - b.price);
                break;
            case "high-to-low":
                sortedItems.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }

        setFilteredItems(sortedItems);
        setCurrentPage(1);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="px-10">
            <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
                <div className="py-48 flex flex-col items-center justify-center text-center space-y-7">
                    <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
                        For the Love of Delicious <span className="text-red">Food</span>
                    </h2>
                    <p className="text-xl md:w-4/5 mx-auto">
                        Come with family & feel the joy of mouthwatering food such as Greek Salad, Lasagne, Butternut Pumpkin, Tokusen Wagyu, Olivas Rellenas and more for a moderate cost.
                    </p>
                    <button className="bg-red font-semibold btn text-white px-8 py-3 rounded-full">
                        Order Now
                    </button>
                </div>
            </div>

            <div className="section-container">
                <div className="flex flex-col md:flex-row flex-wrap md:justify-between items-center space-y-3 mb-8">
                    <div className="flex flex-row justify-start md:items-center md:gap-8 gap-4 flex-wrap">
                        <button onClick={showAll} className={`py-2 px-4 rounded ${selectedCategory === "all" ? "active" : ""}`}>
                            All
                        </button>
                        <button onClick={() => filterItems("salad")} className={`py-2 px-4 rounded ${selectedCategory === "salad" ? "active" : ""}`}>
                            Salad
                        </button>
                        <button onClick={() => filterItems("pizza")} className={`py-2 px-4 rounded ${selectedCategory === "pizza" ? "active" : ""}`}>
                            Pizza
                        </button>
                        <button onClick={() => filterItems("soup")} className={`py-2 px-4 rounded ${selectedCategory === "soup" ? "active" : ""}`}>
                            Soups
                        </button>
                        <button onClick={() => filterItems("dessert")} className={`py-2 px-4 rounded ${selectedCategory === "dessert" ? "active" : ""}`}>
                            Desserts
                        </button>
                        <button onClick={() => filterItems("drinks")} className={`py-2 px-4 rounded ${selectedCategory === "drinks" ? "active" : ""}`}>
                            Drinks
                        </button>
                    </div>

                    <div className="flex justify-end mb-4 rounded-sm">
                        <div className="bg-red p-2">
                            <FaFilter className="h-4 w-4 text-white" />
                        </div>
                        <select onChange={(e) => handleSortChange(e.target.value)} value={sortOption} className="bg-red text-white px-2 py-1 rounded-sm">
                            <option value="default">Default</option>
                            <option value="A-Z">A-Z</option>
                            <option value="Z-A">Z-A</option>
                            <option value="low-to-high">Low to High</option>
                            <option value="high-to-low">High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                    {currentItems.map((item) => (
                        <div key={item.id} className="card shadow-xl relative mr-5 md:my-5">
                            <div className="card-body">
                                <img src={item.image} alt={item.name} className="hover:scale-105 transition-all duration-300 md:h-72" />
                                <h2 className="card-title mt-2">{item.name}</h2>
                                <p>Description of the item</p>
                                <div className="card-actions justify-between items-center mt-2">
                                    <h5 className="font-semibold">
                                        <span className="text-sm text-red">$</span> {item.price}
                                    </h5>
                                    <button onClick={() => addToCart(item)} className="btn bg-red text-white">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center my-8">
                {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }).map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`mx-1 px-3 py-1 rounded-full ${currentPage === index + 1 ? "bg-red text-white" : "bg-gray-200 text-black"}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Menu;
