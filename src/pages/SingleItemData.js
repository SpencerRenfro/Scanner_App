import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//hooks
import { useFetch } from "../hooks/useFetch";
import { useParams } from "react-router-dom";
//Barcode
import BarcodeGenerator from "../components/BarcodeGenerator";
//images
import deleteIcon from "../assets/icons/delete.svg";
import editIcon from "../assets/icons/edit2.svg";

function SingleItemData() {
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

  return (
    <div className="flex justify-center">
      {error && <div className="error">{error}</div>}
      {isPending && (
        <span className="loading loading-spinner loading-lg"></span>
      )}
      {item && (
        <div>
          <BarcodeGenerator barcodeState={barcodeState} />
        </div>
      )}
    </div>
  );
}

export default SingleItemData;
