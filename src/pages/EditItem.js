import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
//custom-hooks
import { useFetch } from "../hooks/useFetch";
//components
import BarcodeGenerator from "../components/BarcodeGenerator";
//images
import deleteIcon from "../assets/icons/delete.svg";
import editIcon from "../assets/icons/edit2.svg";

export default function EditItem({setItemUpdateFailure, setItemUpdateSuccess, setItemName}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const url = `http://localhost:8000/inventory/${id}`;
  const { data: item, error, isPending } = useFetch(url);

  // PUT Request
  const {
    putData,
    data: putDataResponse,
    error: putError,
    isPending: putIsPending,
  } = useFetch(url, "PUT");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [price, setPrice] = useState(0.0);
  const [collection, setCollection] = useState([]);
  const [barcodeState, setBarcodeState] = useState("");

  useEffect(() => {
    if (item) {
      // Populate editable fields
      setName(item.name);
      setDescription(item.description);
      setCategory(item.category);
      setStatus(item.status);
      setPrice(item.price);
      setCollection(item.itemCollection || []); // Ensure collection is an array
      setBarcodeState(item.barcode);
    }
  }, [item]);

  useEffect(() => {
    if (putDataResponse) {
        navigate("/");
        setItemUpdateSuccess(true);
        setItemName(name);
      } 
  }, [putDataResponse]);

  const deleteCollectionItem = (index) => {
    setCollection(collection.filter((_, i) => i !== index));
  };

  const editCollectionItem = (index) => {
    // Get the item to be edited
    const itemToEdit = collection[index];

    // Ask for new value
    const newValue = prompt("Edit item:", itemToEdit);

    if (newValue !== null && newValue !== "") {
      // Create a new array with the updated value
      const updatedCollection = collection.map((item, i) =>
        i === index ? newValue : item
      );

      // Update the state with the modified collection
      setCollection(updatedCollection);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the updated item data, keeping other fields intact
    const updatedItem = {
      ...item, // Copy all other fields from the original item
      name, // Overwrite the fields that are modifiable
      description,
      category,
      status,
      price,
      itemCollection: collection, // Update the itemCollection field
    };

    // Send PUT request with updated item data
    putData(updatedItem);

    if (putError) {
      console.log("Error updating item:", putError);
    }
  };

  return (
    <div className="flex justify-center">
      {error && <div className="error">{error}</div>}
      {isPending && (
        <span className="loading loading-spinner loading-lg"></span>
      )}
      {putIsPending ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : (
        item && (
          <form onSubmit={handleSubmit} className="w-1/3 mt-10 ">
            <div className="card border shadow-lg ">
              <div className="card-body ">
                <div className="form-group">
                  <label className="font-bold">Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered w-full bg-inherit"
                    required
                  />
                </div>
                <div className="form-group mt-4">
                  <label className="font-bold">Description:</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea textarea-bordered w-full bg-inherit"
                    required
                  />
                </div>
                <div className="form-group mt-4">
                  <label className="font-bold">Category:</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input input-bordered w-full bg-inherit"
                    required
                  />
                </div>
                <div className="form-group mt-4">
                  <label className="font-bold">Price:</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="input input-bordered w-full bg-inherit"
                    required
                  />
                </div>
                <div className="form-group mt-4">
                  <label className="font-bold">Collections:</label>
                  <ul>
                    {collection.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span>{item}</span>
                        <button
                          type="button"
                          className="ml-4 text-red-600"
                          onClick={() => deleteCollectionItem(index)}
                        >
                          <img src={deleteIcon} alt="Delete" />
                        </button>
                        <button
                          type="button"
                          className="ml-4 text-blue-600"
                          onClick={() => editCollectionItem(index)}
                        >
                          <img src={editIcon} width={25} alt="Edit" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="form-group mt-4">
                  <label className="font-bold">Status:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="select select-bordered w-full bg-inherit"
                    required
                  >
                    <option value="IN">IN</option>
                    <option value="OUT">OUT</option>
                  </select>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="btn btn-outline mt-6 flex "
                    disabled={putIsPending}
                  >
                    Update Item
                  </button>
                </div>
              </div>
              <div className="flex justify-center my-2 mb-5">
                <BarcodeGenerator barcodeState={barcodeState} />
              </div>
            </div>
          </form>
        )
      )}
    </div>
  );
}
