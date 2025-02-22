import React, { useState, useEffect } from "react";
import BarcodeGenerator from "../components/BarcodeGenerator";
import { useFetch } from "../hooks/useFetch";
import { useBarcodeGenerator } from "../hooks/useBarcodeGenerator";
import { useNavigate, NavLink } from "react-router-dom";
import deleteIcon from "../assets/icons/delete.svg";

//icons
import close from "../assets/icons/close.svg";
//custom-hooks
import useFormattedDate from "../hooks/useFormattedDate";

export default function AddItem({
  setItemCreationSuccess,
  setItemCreationFailure,
  handleHideNavbar,
  setHideNavbar,
}) {
  // States and Hooks
  const [customCategory, setCustomCategory] = useState(false);
  const [tempItem, setTempItem] = useState("");
  const [barcodeState, setBarcodeState] = useState();
  const { date, dayOfWeek, time } = useFormattedDate();
  const navigate = useNavigate();

  const {
    postData: postInventoryData,
    data: inventoryData,
    error: inventoryError,
  } = useFetch("http://localhost:8000/inventory", "POST");
  const {
    postData: postCategoryData,
    data: categorySubmission,
    error: categoryError,
  } = useFetch("http://localhost:8000/categories", "POST");
  const { data: categories, error: categoryErrorFetch } = useFetch(
    "http://localhost:8000/categories",
    "GET"
  );

  const {
    postData: postLogsData,
    data: logsData,
    error: logsError,
  } = useFetch("http://localhost:8000/itemLogs", "POST");

  // objects for posting data

  const [categoriesDataForm, setCategoriesDataForm] = useState({
    name: "",
    barcode: "",
    barcodeCombinedName: "",
  });

  const [logsDataForm, setLogsDataForm] = useState({
    name: "",
    action: "CREATED",
    date: "",
    dayOfWeek: "",
    time: "",
    barcode: "",
    id: "",
    category: "",
  });

  const [formData, setFormData] = useState({
    date: "",
    dayOfWeek: "",
    time: "",
    name: "",
    category: "",
    price: 0.0,
    serialNumber: "",
    description: "",
    barcode: "",
    barcodeCombinedName: "",
    itemCollection: [],
    barcodeUrl: "",
    qrCode: "",
    status: "IN",
  });

  const { canvasRef, barcode } = useBarcodeGenerator(
    formData.name,
    setBarcodeState
  );

  // Check for duplicate categories
  const isDuplicateCategory = (categoryName) => {
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].name === categoryName) {
        return true;
      }
    }
    return false;
  };

  // Add a temporary item to the collection
  const addTempItem = () => {
    if (tempItem.trim() === "") return;
    setFormData((prevFormData) => ({
      ...prevFormData,
      itemCollection: [...prevFormData.itemCollection, tempItem],
    }));
    setTempItem("");
  };

  // Delete a collection item
  const deleteCollectionItem = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      itemCollection: prevFormData.itemCollection.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for duplicate category before submission
    if (
      customCategory &&
      formData.category &&
      isDuplicateCategory(formData.category)
    ) {
      alert(
        "The category name already exists. Please choose a different name."
      );
      return;
    }

    // Post the form data
    try {
      postLogsData(logsDataForm);
      postInventoryData(formData);
      // Add custom category if applicable
      if (
        customCategory &&
        formData.category &&
        !isDuplicateCategory(formData.category)
      ) {
        const newCategoryData = {
          name: formData.category,
          barcode: barcodeState,
          barcodeCombinedName: `${barcodeState}_${formData.name}`,
        };
        postCategoryData(newCategoryData);
      }
    } catch (error) {
      console.log(error);
    }

    console.log("Form Data Submitted:", formData);
    handleHideNavbar(); // Hide the navbar after submission
  };

  useEffect(() => {

    setFormData((prevFormData) => ({
      ...prevFormData,
      date: date,
      dayOfWeek: dayOfWeek,
      time: time,
      barcode: barcodeState,
      barcodeCombinedName: `${barcodeState}_${prevFormData.name}`,
    }));
    setLogsDataForm((prevLogsDataForm) => ({
      ...prevLogsDataForm,
      name: formData.name,
      barcode: barcodeState,
      id: `${barcodeState}_${formData.name}`,
      date: date,
      dayOfWeek: dayOfWeek,
      time: time,
      category: formData.category,
    }));
    setCategoriesDataForm((prevCategoriesDataForm) => ({
      ...prevCategoriesDataForm,
      name: formData.category,
      barcode: barcodeState,
      barcodeCombinedName: `${barcodeState}_${formData.name}`,
    }));
  }, [formData.name, formData.category, barcodeState]);

  // Handle submission success or failure
  useEffect(() => {
    if (inventoryData) {
      navigate("/");
      setItemCreationSuccess(true);
    } else if (inventoryError) {
      setItemCreationFailure(true);
      navigate("/");
    }
  }, [inventoryData, inventoryError]);

  return (
    <div>
      <div className="flex items-center justify-between p-6 shadow-lg">
        <h1>New Item</h1>
        <NavLink
          to="/"
          onClick={() => {
            setHideNavbar(false);
            console.log("hideNavbar: false");
          }}
        >
          <img src={close} width={25} alt="close" />
        </NavLink>
      </div>
      <div className="mx-40 pb-40 grid grid-cols-12 mt-7 gap-4">
        <form className="col-start-4 col-span-6 p-4" onSubmit={handleSubmit}>
          <h1 className="font-bold">Add New Item</h1>
          <p>Add information about your item</p>
          <input
            type="text"
            placeholder="Item Name"
            className="input input-bordered col-span-5 my-6 py-7 w-full"
            onChange={(e) => {
              setFormData({
                ...formData,
                name: e.target.value,
                barcodeCombinedName: barcode + "_" + e.target.value,
              });
            }}
            required
          />

          <textarea
            type="text"
            placeholder="Item Description"
            className="input input-bordered col-span-5 my-6 pt-3 w-full min-h-48 max-h-72"
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
            }}
            required
          />

          {customCategory ? (
            <input
              type="text"
              placeholder="Custom Category"
              className="input input-bordered col-span-5 my-6 py-7 w-full"
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value });
              }}
              required
            />
          ) : (
            <select
              className="select select-bordered col-span-5 my-6 w-full h-16"
              value={formData.category}
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value });
              }}
              required
            >
              <option value="" disabled selected>
                Select Category
              </option>
              {categories?.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          )}

          <div className="flex pl-5 gap-5">
            <input
              type="checkbox"
              className="checkbox"
              onClick={() => setCustomCategory(!customCategory)}
            />
            <label className="checkbox-label">Add Custom Category</label>
          </div>

          <input
            type="text"
            placeholder="Item Price"
            className="input input-bordered col-span-5 my-6 py-7 w-full"
            onChange={(e) => {
              setFormData({ ...formData, price: parseFloat(e.target.value) });
            }}
            required
          />
          <input
            type="text"
            placeholder="Serial Number"
            className="input input-bordered col-span-5 my-6 py-7 w-full"
            onChange={(e) => {
              setFormData({ ...formData, serialNumber: e.target.value });
            }}
            required
          />
          <div className="col-span-4 flex items-center gap-5 my-6">
            <input
              type="text"
              placeholder="Add collection of subitems"
              className="input input-bordered col-span-5 my-6 py-7 w-full"
              value={tempItem}
              onChange={(e) => setTempItem(e.target.value)}
            />
            <button type="button" className="btn" onClick={addTempItem}>
              ADD
            </button>
          </div>
          <ul>
            {formData.itemCollection.map((item, index) => (
              <li key={index} className="flex justify-between">
                {item}
                <button onClick={() => deleteCollectionItem(index)}>
                  <img src={deleteIcon} alt="Delete" />
                </button>
              </li>
            ))}
          </ul>
          <button
            className="btn bg-indigo-900 text-white hover:bg-indigo-700"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
