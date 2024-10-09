import { NavLink, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
//custom-hooks
import { useFetch } from "../hooks/useFetch";

//components
import SignOutForm from "../components/sign-out/SignOutForm";

//images
import close from "../assets/close.svg";
import dollarSign from "../assets/icons/dollar-sign.svg";

export default function SignOut() {
  const { id } = useParams();
  const url = `http://localhost:8000/inventory/${id}`;
  const { data: item, isPending, error } = useFetch(url);

  //customer info
  const [customerName, setCustomerName] = useState("");
  const [customerFirstName, setCustomerFirstName] = useState("");
    const [customerLastName, setCustomerLastName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const handleSignOut = (e) => {
    e.preventDefault();
    const signOutFormData = {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      action: "OUT",
      barcode: item.barcode,
    };
    console.log(signOutFormData);
  };

  return (
    <div className="">
      <div className="flex items-center justify-between p-6 shadow-lg">
        <h1>Sign Item Out</h1>
        <button>
        <NavLink to="/">
          <img src={close} width={25} alt="close" />
        </NavLink>
        </button>
      </div>
      {error && <div>{error}</div>}
      {isPending && (
        <span className="loading loading-spinner loading-lg"></span>
      )}
      <div className="grid grid-cols-12 mt-10">
        {item && (
          <div className="col-start-4 col-span-5 border p-6">
            <h2 className="py-1">{item.name}</h2>
            <p className="py-1">{item.description}</p>
            <div className="flex py-1">
              <img src={dollarSign} width={15} alt="dollar sign" />
              <p>{item.price}</p>
            </div>
            <div className="badge bg-slate-300 p-3 ">
              <p>{item.category}</p>
            </div>
          </div>
        )}
        <div className="col-span-5 col-start-4 mt-12 mb-6">
          <SignOutForm
            // customerName={customerName}
            //setCustomerName={setCustomerName}
            customerFirstName={customerFirstName}
            setCustomerLastName={setCustomerLastName}
            // customerEmail={customerEmail}
            setCustomerEmail={setCustomerEmail}
            // customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            url={url}
            handleSignOut={handleSignOut}
          />
        </div>
      </div>
    </div>
  );
}
