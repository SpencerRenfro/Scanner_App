import { NavLink, useParams } from "react-router-dom";
import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import SignOutForm from "../components/sign-out/SignOutForm";
import close from "../assets/close.svg";
import dollarSign from "../assets/icons/dollar-sign.svg";

export default function SignOut({ handleHideNavbar }) {
  const { id } = useParams();
  const url = `http://localhost:8000/inventory/${id}`;
  const { data: item, isPending, error } = useFetch(url);

  const [newCustomerData, setNewCustomerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    action: "OUT",
    barcode: "",
  });

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveCustomerInfoChecked, setSaveCustomerInfoChecked] = useState(false);

  const handleSaveCustomerInfo = () => {
    const customerData = {
      ...newCustomerData,
      fullName: `${newCustomerData.firstName} ${newCustomerData.lastName}`,
      barcode: item?.barcode || "",
    };

    fetch("http://localhost:8000/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
    })
      .then(() => {
        console.log("Customer information saved.");
      })
      .catch((error) => {
        console.error("Error saving customer information:", error);
      });
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    setShowSaveModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between p-6 shadow-lg">
        <h1>Sign Item Out</h1>
        <button onClick={handleHideNavbar}>
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
            url={url}
            handleSignOut={handleSignOut}
            setNewCustomerData={setNewCustomerData}
          />
        </div>
      </div>
      {showSaveModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Save Customer Information</h2>
            <p className="mt-4">Would you like to save the customer information?</p>
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="save-customer-checkbox"
                className="mr-2"
                checked={saveCustomerInfoChecked}
                onChange={(e) => setSaveCustomerInfoChecked(e.target.checked)}
              />
              <label htmlFor="save-customer-checkbox">Save customer info</label>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="btn btn-secondary"
                onClick={() => setShowSaveModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowSaveModal(false);
                  if (saveCustomerInfoChecked) {
                    handleSaveCustomerInfo();
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
