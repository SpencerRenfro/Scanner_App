import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
//custom-hooks
import { useFetch } from "../hooks/useFetch";

//images
import deleteIcon from "../assets/icons/delete.svg";
import editIcon from "../assets/icons/edit2.svg";
import close from "../assets/close.svg";

export default function EditItemPage({
  setItemUpdateSuccess,
  setItemUpdateFailure,
  setItemName,
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const url = `http://localhost:8000/inventory/${id}`;
  const { data: item, error, isPending } = useFetch(url);

  const [customCategory, setCustomCategory] = useState(false);

  // PUT Request
  const {
    putData,
    data: putDataResponse,
    error: putError,
    isPending: putIsPending,
  } = useFetch(url, "PUT");

  const [itemData, setItemData] = useState({
    name: "",
    description: "",
    category: "",
    status: "",
    price: 0.0,
    collection: [],
    barcode: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    if (item) {
      setItemData({
        name: item.name,
        description: item.description,
        category: item.category,
        status: item.status,
        price: item.price,
        collection: item.itemCollection || [],
        barcode: item.barcode,
      });
    }
  }, [item]);

  const handleSUbmit = (e) => {
    e.preventDefault();
    try {
      putData(itemData);
      navigate("/");
    } catch (error) {
      setItemUpdateFailure(true);
    }
  };

  return (
    <div>
      {error && <div>{error}</div>}
      {isPending && <div>Loading...</div>}
      <div className="flex items-center justify-between p-6 shadow-lg">
        <h1>Edit Item</h1>
        <NavLink to={"/"}>
          <img src={close} width={25} alt="close" />
        </NavLink>
      </div>
      {item && (
        <form
          onSubmit={handleSUbmit}
          className="grid grid-cols-12 mt-10 col-start-4 col-span-5"
        >
          <div className="col-start-4 col-span-5">
            <h1>Edit Item</h1>
            <h2>Add information about your item</h2>
          </div>
          <div className="col-start-4 col-span-5 gap-5">
            <input
              className="input input-bordered my-6 py-7 w-full"
              type="text"
              placeholder="Item Name"
              value={itemData.name}
            />
          </div>
          <div className="col-start-4 col-span-5 gap-5">
            <textarea
              className="input input-bordered my-6 py-7 w-full min-h-48 max-h-72"
              type="text"
              placeholder="Item Description"
              value={itemData.description}
            />
          </div>
          <div className="col-start-4 col-span-5 gap-5">
            {customCategory ? (
              <input
                type="text"
                placeholder="Custom Category"
                className="input input-bordered  my-6 py-7 w-full"
              />
            ) : (
              <select
                className="select select-bordered my-6 w-full h-16"
                value={itemData.category}
              >
                <option disabled selected>
                  Select Category
                </option>
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
          </div>
          <div className="col-start-4 col-span-5 gap-5">
            <input
              type="text"
              placeholder="Price"
              className="input input-bordered my-6 py-7 w-full"
              value={itemData.price}
            />
          </div>
          <div className="col-start-4 col-span-5 gap-5">
            <input
              type="text"
              placeholder="Serial Number"
              className="input input-bordered  my-6 py-7 w-full"
              value={itemData.serialNumber}
            />
          </div>
          <div className="col-start-4 col-span-5 gap-5">
            {itemData.collection ? (
              <div>
                <h2>Collection</h2>
                <ul>
                  {itemData.collection.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span>{item}</span>
                      <div className="flex">
                        <button
                          type="button"
                          className="ml-4 text-blue-600"
                          // onClick={() => editCollectionItem(index)}
                        >
                          <img src={editIcon} width={25} alt="Edit" />
                        </button>
                        <button
                          type="button"
                          className="ml-4 text-red-600"
                          // onClick={() => deleteCollectionItem(index)}
                        >
                          <img src={deleteIcon} alt="Delete" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Add Collection"
                  className="input input-bordered  my-6 py-7 w-full"
                  // value={itemData.collection}
                />
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
