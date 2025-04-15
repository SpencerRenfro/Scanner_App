import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
//hooks
import { useFetch } from "../hooks/useFetch";
import { useParams } from "react-router-dom";
//Barcode
import BarcodeCard from "../components/BarcodeCard";
//images
import deleteIcon from "../assets/icons/delete.svg";
import editIcon from "../assets/icons/edit2.svg";
import close from "../assets/close.svg";
import scan from "../assets/icons/scan.svg";

function SingleItemData({ setHideNavbar }) {
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

  // Set hideNavbar to true when component mounts
  useEffect(() => {
    setHideNavbar(true);

    // Cleanup function to reset hideNavbar when component unmounts
    return () => {
      setHideNavbar(false);
    };
  }, [setHideNavbar]);

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
    <div className="bg-slate-100 min-h-screen">
      {/* Navbar similar to Add New Item page */}
      <div className="flex items-center justify-between p-6 shadow-lg bg-slate-100">
        <div className="flex items-center gap-3">
          <img src={scan} width={28} height={28} alt="barcode" className="opacity-80" />
          <h1 className="text-xl font-semibold">{item ? item.name : 'Item Details'}</h1>
        </div>
        <NavLink
          to="/"
          className="hover:bg-gray-100 p-2 rounded-full transition-colors flex items-center justify-center"
        >
          <img src={close} width={24} alt="close" />
        </NavLink>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && <div className="text-red-500 text-center p-4">{error}</div>}
        {isPending && (
          <div className="flex justify-center p-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}
        {item && (
          <div>
            <BarcodeCard item={item} />
          </div>
        )}
      </div>
    </div>
  );
}

export default SingleItemData;
