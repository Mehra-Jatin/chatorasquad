import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Trash, X } from "lucide-react";
import apiClient from "../../services/apiClient";
import { ToastContainer, toast } from "react-toastify";
const formatDate = (date) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
};
const CuisineCard = ({ cuisine, date, onEdit, onDelete }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between items-center w-60 h-48 transition-transform duration-300 ease-in-out hover:scale-105"
      whileHover={{ boxShadow: "0 15px 30px rgba(0,0,0,0.2)" }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h3 className="text-xl font-bold text-gray-800">{cuisine}</h3>
        <p className="text-sm text-gray-500">{formatDate(date)}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition duration-200"
        >
          <div className="flex items-center gap-1">
            <Pencil className="mt-1" />
            <span>Edit</span>
          </div>
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
        >
          <div className="flex items-center gap-1">
            <Trash className="mt-1" />
            <span>Delete</span>
          </div>
        </button>
      </div>
    </motion.div>
  );
};
const ViewCuisine = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [cuisines, setCuisines] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCuisine, setCurrentCuisine] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await apiClient.get("/admin/cuisines");
        setCuisines(response.data);
      } catch (error) {
        console.error("Error fetching cuisines:", error);
        toast.error("Failed to fetch cuisines.", {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    };
    fetchCuisines();
  }, []);
  const filteredCuisines = cuisines.filter((cuisine) => {
    const matchesName = cuisine?.name
      ?.toLowerCase()
      .includes(searchTerm?.toLowerCase());
    const matchesDate = cuisine?.date?.includes(searchDate);
    return matchesName && matchesDate;
  });
  const handleEdit = (cuisine) => {
    setCurrentCuisine(cuisine);
    setIsModalOpen(true);
  };
  const handleDelete = (cuisine) => {
    setCurrentCuisine(cuisine);
    setIsConfirmDeleteOpen(true);
  };
  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/admin/deletecuisine/${currentCuisine._id}`);
      setCuisines((prev) => prev.filter((c) => c._id !== currentCuisine._id));
      toast.success("Cuisine deleted successfully.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error deleting cuisine:", error);
      toast.error("Failed to delete cuisine.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } finally {
      setIsConfirmDeleteOpen(false);
    }
  };
  const handleCancelDelete = () => {
    setIsConfirmDeleteOpen(false);
  };
  const handleSave = async () => {
    try {
      setCuisines((prev) =>
        prev.map((c) => (c._id === currentCuisine._id ? currentCuisine : c))
      );
      const response = await apiClient.put(
        `/admin/updatecuisine/${currentCuisine._id}`,
        {
          name: currentCuisine.name,
        }
      );
      toast.success("Cuisine updated successfully.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error updating cuisine:", error);
      toast.error("Failed to update cuisine.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } finally {
      setIsModalOpen(false);
    }
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-4">Cuisines</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by cuisine name"
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-4">
        {filteredCuisines.map((cuisine, index) => (
          <CuisineCard
            key={index}
            cuisine={cuisine.name}
            date={cuisine.date}
            onEdit={() => handleEdit(cuisine)}
            onDelete={() => handleDelete(cuisine)}
          />
        ))}
      </div>
      <AnimatePresence>
        {isConfirmDeleteOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
              <h2 className="text-xl font-bold mb-4">Confirm Delete {currentCuisine.name} Cuisine </h2>
              <p className="mb-4">
              </p> a
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancelDelete}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                > Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                > Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold mb-4">Edit Cuisine</h2>
                <X
                  size={33}
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer hover:bg-yellow-200 transition-all delay-100 rounded-full"
                />
              </div>
              <input
                type="text"
                value={currentCuisine?.name || ""}
                className="border border-orange-500 focus:border-orange-500 rounded p-4 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
                onChange={(e) =>
                  setCurrentCuisine({
                    ...currentCuisine,
                    name: e.target.value,
                  })
                }
              />
              <div className="flex justify-end gap-2">
                <button  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-200"
                > Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer />
    </div>
  );
};
export default ViewCuisine;