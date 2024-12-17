import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
//hooks
import { useFetch } from "../hooks/useFetch";
import { useParams } from "react-router-dom";
//Barcode
import BarcodeGenerator from "../components/BarcodeGenerator";
//images
import close from "../assets/close.svg";

export default function BarcodePage() {
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

  const [barcodeState, setBarcodeState] = useState("");
  const [itemName, setItemName] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (item) {
      // Populate editable fields
      setBarcodeState(item.barcode);
      setItemName(item.name);
      setStatus(item.status);
    }
  }, [item]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-6 shadow-lg">
        <h1>Item</h1>
        <NavLink
          to="/"
          onClick={() => {
            console.log("hideNavbar: false");
          }}
        >
          <img src={close} width={25} alt="close" />
        </NavLink>
      </div>
      {error && <div className="error">{error}</div>}
      {isPending && (
        <span className="loading loading-spinner loading-lg"></span>
      )}
      <div className="flex justify-center mt-7">
        {item && (
          <div className="col-start-4 col-span-4 ">
            <div className="flex justify-between py-5">
              <h1 className="">{item.name}</h1>
              <p>{item.status}</p>
            </div>
            <BarcodeGenerator barcodeState={barcodeState} />
          </div>
        )}
      </div>
    </div>
  );
}
