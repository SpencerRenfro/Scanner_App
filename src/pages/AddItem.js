import React, { useState, useEffect } from "react";
import BarcodeGenerator from "../components/BarcodeGenerator";
import { useFetch } from "../hooks/useFetch";
import { useBarcodeGenerator } from "../hooks/useBarcodeGenerator";
import { useNavigate } from "react-router-dom";
import deleteIcon from "../assets/icons/delete.svg";

export default function AddItem({setItemCreationSuccess, setItemCreationFailure}) {
  const [customCategory, setCustomCategory] = useState(false);
  const [tempItem, setTempItem] = useState("");
  const [barcodeState, setBarcodeState] = useState();
  const navigate = useNavigate();

  const {
    postData: postInventoryData,
    data: inventoryData,
    error: inventoryError,
  } = useFetch("http://localhost:8000/inventory", "POST");

  const {
    postData: postLogsData,
    data: logsData,
    error: logsError,
  } = useFetch("http://localhost:8000/itemLogs", "POST");

  const {
    postData: postCategoryData,
    data: categorySubmission,
    error: categoryError,
  } = useFetch("http://localhost:8000/categories", "POST");

  const { data: categories, error: categoriesError } = useFetch(
    "http://localhost:8000/categories",
    "GET"
  );

  const [formData, setFormData] = useState({
    date: "",
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

  const [logsDataForm, setLogsDataForm] = useState({
    name: "",
    action: "CREATED",
    date: "",
    barcode: "",
    id: "",
  });

  const [categoriesDataForm, setCategoriesDataForm] = useState({
    name: "",
    barcode: "",
    barcodeCombinedName: "",
  });

  const { canvasRef, barcode, barcodeObject } = useBarcodeGenerator(
    formData.name,
    setBarcodeState
  );

  const isDuplicateCategory = (categoryName) => {
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].name === categoryName) {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postInventoryData(formData);
    postLogsData(logsDataForm);

    if (
      customCategory &&
      formData.category &&
      !isDuplicateCategory(formData.category)
    ) {
      postCategoryData(categoriesDataForm);
    }
  };

  const handleCategoryCheckBox = () => {
    setCustomCategory(!customCategory);
  };

  const addTempItem = () => {
    if (tempItem.trim() === "") {
      return;
    }
    setFormData({
      ...formData,
      itemCollection: [...formData.itemCollection, tempItem],
    });
    setTempItem("");
  };

  const deleteCollectionItem = (key) => {
    setFormData({
      ...formData,
      itemCollection: formData.itemCollection.filter(
        (item, index) => index !== key
      ),
    });
  };

  useEffect(() => {
    let today = new Date().toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      minute: "2-digit",
      hour12: false, // Change to `true` if you want 12-hour format
    });
    setFormData((prevFormData) => ({
      ...prevFormData,
      date: today,
      barcode: barcodeState,
      barcodeCombinedName: `${barcodeState}_${prevFormData.name}`,
    }));
    setLogsDataForm((prevLogsDataForm) => ({
      ...prevLogsDataForm,
      name: formData.name,
      barcode: barcodeState,
      id: `${barcodeState}_${formData.name}`,
      date: today,
    }));
    setCategoriesDataForm((prevCategoriesDataForm) => ({
      ...prevCategoriesDataForm,
      name: formData.category,
      barcode: barcodeState,
      barcodeCombinedName: `${barcodeState}_${formData.name}`,
    }));
  }, [formData.name, barcodeState, formData.category]);
  //added formData.caetegory to dependancy array

  useEffect(() => {
    if (categorySubmission) {
      console.log("Category Submitted");
    }
    if (categoryError) {
      console.log("Category Error:", categoryError);
    }
    if (inventoryData && logsData) {
      // navigate("/item-creation-successful");
      navigate("/");
      setItemCreationSuccess(true);
    } else if (inventoryError || logsError) {
      setItemCreationFailure(true);
    }
    if (logsError || inventoryError) {
      console.log("Error creating item.");
      console.log("Inventory Error:", inventoryError);
      console.log("Logs Error:", logsError);
      navigate("/item-creation-failure");
    }
  }, [inventoryData, logsData]);

  return (
    <div className="w-full flex justify-center">
      <div className=" dark:text-slate-900 w-1/3 my-10 mx-20 shadow-xl rounded-xl relative border-2">
        <form className="mx-20 mt-10" onSubmit={handleSubmit}>
          <div className="flex flex-col w-full gap-5 items-start">
            <label className="w-full">
              <h2 className="font-bold dark:text-white">Item Name</h2>
              <input
                className="w-full rounded-xl "
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    barcodeCombinedName: barcode + "_" + e.target.value,
                  })
                }
                required
              />
            </label>
            {customCategory === false ? (
              <div className="w-full">
                <label htmlFor="location" className="font-bold dark:text-white">
                  <div className="flex">
                    <h2>Category</h2>
                  </div>
                </label>
                <select
                  id="location"
                  name="location"
                  className="w-full rounded-xl focus:ring-slate-900 focus:border-slate-900"
                  defaultValue="other"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                >
                  {categories &&
                    categories.map((category) => (
                      <option
                        style={{ backgroundColor: "#cbd5e1" }}
                        value={category.name}
                        key={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <label className="w-full">
                <h2 className="font-bold dark:text-white">Custom Category</h2>
                <input
                  className="w-full rounded-xl  dark:focus:border-2 dark:focus"
                  type="text"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                    })
                  }
                  required
                />
              </label>
            )}
            <div className="flex gap-5">
              <label>
                <h2>Add Custom Category</h2>
              </label>
              <input
                type="checkbox"
                className="checkbox"
                onClick={handleCategoryCheckBox}
              />
            </div>
            <label className="w-full">
              <h2 className="font-bold dark:text-white">Item Price</h2>
              <input
                className="w-full rounded-xl  dark:focus:ring-purple-200 dark:focus:border-2 dark:focus"
                type="text"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
                required
              />
            </label>
            <label className="w-full">
              <h2 className="font-bold dark:text-white ">Serial Number</h2>
              <input
                className="w-full rounded-xl dark:text-white dark:focus:ring-purple-200 dark:focus:border-2 dark:focus"
                type="text"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    serialNumber: e.target.value,
                  })
                }
                required
              />
            </label>
            <label className="w-full">
              <h2 className="font-bold dark:text-white">Item Description</h2>
              <input
                className="w-full rounded-xl"
                type="text"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />
            </label>
            <div className="w-full flex flex-col gap-2">
              <h2 className="font-bold dark:text-white">
                Add Items to Collection
              </h2>
              <div className="w-full flex flex-row gap-2">
                <input
                  className="w-4/5 rounded-xl "
                  type="text"
                  value={tempItem}
                  onChange={(e) => setTempItem(e.target.value)}
                />
                <button
                  className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                  onClick={addTempItem}
                >
                  Add Item
                </button>
              </div>
              <div>
                <ul className="dark:text-white">
                  {formData.itemCollection.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      {item}
                      <button
                        className="ml-4 text-red-600"
                        onClick={() => deleteCollectionItem(index)}
                      >
                        <img src={deleteIcon} alt="Delete" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <button
              className="text-white dark:text-black bg-slate-700 dark:bg-slate-200 hover:bg-slate-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
        <div className="w-full flex flex-col items-center mt-5 pb-2">
          <BarcodeGenerator
            barcodeState={barcodeState}
            // setBarcodeState={setBarcodeState}
            // barcodeObject={barcodeObject}
          />
        </div>
      </div>
    </div>
  );
}
