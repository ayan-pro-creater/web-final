import React from "react";
import { FaUtensils } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { db } from "../../../firebase/firebase"; // Correctly import Firestore
import { collection, addDoc } from "firebase/firestore";
import Swal from 'sweetalert2'; // Import SweetAlert

const AddMenu = () => {
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        const imageFile = data.image[0];

        // Upload image to ImgBB
        const imageUrl = await uploadImageToImgBB(imageFile);

        const menuItem = {
            name: data.name,
            category: data.category,
            price: parseFloat(data.price),
            recipe: data.recipe,
            image: imageUrl,
        };

        try {
            await addDoc(collection(db, "menu"), menuItem);
            reset();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Your Item has been inserted successfully!",
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error("Error adding document: ", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong while adding the item!",
            });
        }
    };

    // Function to upload image to ImgBB and return the URL
    const uploadImageToImgBB = async (imageFile) => {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=35887815b768a904bab6cb35a2298eca`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (data.success) {
            return data.data.url; // Return the image URL
        } else {
            throw new Error(data.message); // Throw an error if upload fails
        }
    };

    return (
        <div className="w-full md:w-[870px] px-4 mx-auto">
            <h2 className="text-2xl font-semibold my-4">
                Upload A New <span className="text-red">Menu Item</span>
            </h2>

            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Product Name*</span>
                        </label>
                        <input
                            type="text"
                            {...register("name", { required: true })}
                            placeholder="Produt Name"
                            className="input input-bordered w-full"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="form-control w-full my-6">
                            <label className="label">
                                <span className="label-text">Category*</span>
                            </label>
                            <select
                                {...register("category", { required: true })}
                                className="select select-bordered"
                                defaultValue="default"
                            >
                                <option disabled value="default">
                                    Select a category
                                </option>
                                <option value="salad">Salad</option>
                                <option value="pizza">Pizza</option>
                                <option value="soup">Soup</option>
                                <option value="dessert">Dessert</option>
                                <option value="drinks">Drinks</option>
                                <option value="popular">Popular</option>
                            </select>
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Price*</span>
                            </label>
                            <input
                                type="number"
                                {...register("price", { required: true })}
                                placeholder="Price"
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Product Details</span>
                        </label>
                        <textarea
                            {...register("recipe", { required: true })}
                            className="textarea textarea-bordered h-24"
                            placeholder="Tell the world about your recipe"
                        ></textarea>
                    </div>

                    <div className="form-control w-full my-6">
                        <input
                            {...register("image", { required: true })}
                            type="file"
                            className="file-input w-full max-w-xs"
                        />
                    </div>

                    <button className="btn bg-red text-white px-6">
                        Add Item <FaUtensils />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddMenu;
