import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
//components
import SaveCustomerModal from "../components/sign-out/SaveCustomerModal";
import SignOutForm from "../components/sign-out/SignOutForm";
import ReturningCustomerSignout from "../components/sign-out/ReturningCustomerSignout";
//images
import close from "../assets/close.svg";
import dollarSign from "../assets/icons/dollar-sign.svg";

export default function SignOut({
  handleHideNavbar,
  setItemSignOutSuccess,
  setItemSignOutFailure,
  setHideNavbar,
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const url = "http://localhost:8000/";
  //GET Requests
  const { data: item, isPending, error } = useFetch(url + `inventory/${id}`);
  const {
    data: customerList,
    CustomerListIsPending,
    customerListError,
  } = useFetch(url + "customers");
  // PUT Requests
  const {
    putData: putItemOut,
    data: putItemOutResponse,
    error: putItemOutError,
    isPending: putItemOutIsPending,
  } = useFetch(url + `inventory/${id}`, "PUT");

  //POST Requests
  const {
    postData: newCustomerPost,
    newCustomerPostIsPending,
    newCustomerPostError,
  } = useFetch(url + "customers", "POST");
  const {
    postData: signOutReceiptPost,
    signOutReceiptPostIsPending,
    signOutReceiptPostError,
  } = useFetch(url + "itemLogs", "POST");

  //returning customer
  const [returningCustomer, setReturningCustomer] = useState(false);

  const [newCustomerData, setNewCustomerData] = useState({});
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveCustomerInfoChecked, setSaveCustomerInfoChecked] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveCustomerInfo = () => {
    console.log("saving new customer..");
    const customerData = {
      ...newCustomerData,
      ...formData,
      fullName: `${formData.firstName} ${formData.lastName}`,
      barcode: Math.floor(Math.random() * 1e8) + formData.lastName,
    };
    try {
      newCustomerPost(customerData);
    } catch (error) {
      console.log("error:", error);
    }
    setShowSaveModal(false);
    if (newCustomerPost) {
      console.log("new customer posted", newCustomerPost);
    }
  };

  const handleReceiptLog = () => {
    const signOutReceipt = {
      id: item.id,
      name: item.name,
      action: "OUT",
      date: new Date().toLocaleDateString(),
      barcode: item.barcode,
      dayOfWeek: new Date().toLocaleDateString("en-US", { weekday: "long" }),
      time: new Date().toLocaleTimeString(),
      category: item.category,
    };
    try {
      signOutReceiptPost(signOutReceipt);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignItemOut = () => {
    console.log("signing item out..");
    const updatedItem = {
      ...item,
      status: "OUT",
    };
    try {
      putItemOut(updatedItem);
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmSignOut = async () => {
    try {
      if (saveCustomerInfoChecked) {
        await handleSaveCustomerInfo(); // Save customer info if checkbox is checked
      }
      await handleReceiptLog(); // Create the receipt log
      await handleSignItemOut(); // Update the item's status to OUT

      setItemSignOutSuccess(true);
      navigate("/"); // Navigate after all operations are complete
    } catch (error) {
      console.error("Error during sign-out process:", error);
      setItemSignOutFailure(true);
      navigate("/");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!returningCustomer){
      setShowSaveModal(true);
    }

  };

  useEffect(() => {
    console.log("customerList:", customerList);
  }, [newCustomerData]);
  return (
    <div>
      {error && <div>Item error:{error}</div>}
      {isPending && <div>Loading...</div>}
      {customerListError && <div>Customer List error:{customerListError}</div>}
      <div className="flex items-center justify-between p-6 shadow-lg">
        <h1>Sign Item Out</h1>
        <NavLink to="/" onClick={handleHideNavbar}>
          <img src={close} width={25} alt="close" />
        </NavLink>
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
        <div className="col-start-4 col-span-5 gap-5">
          <input
            placeholder="Returning Customer?"
            type="checkbox"
            onClick={() => setReturningCustomer(!returningCustomer)}
          />
          <label>Returning Customer?</label>
        </div>
        {returningCustomer === true ? (
          <ReturningCustomerSignout customerList={customerList} />
        ) : (
          <div className="col-span-5 col-start-4 mt-12 mb-6">
            <SignOutForm
              handleInputChange={handleInputChange}
              url={url}
              // handleSignOut={handleSignOut} // replaced with handleSubmit
              handleSubmit={handleSubmit}
              setNewCustomerData={setNewCustomerData}
            />
          </div>
        )}
        <div className="col-start-4">
          <button
            className="btn bg-indigo-950 text-white mt-5"
            type="submit"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
      {showSaveModal && !returningCustomer && (
        <SaveCustomerModal
          saveCustomerInfoChecked={saveCustomerInfoChecked}
          setSaveCustomerInfoChecked={setSaveCustomerInfoChecked}
          setShowSaveModal={setShowSaveModal}
          handleSaveCustomerInfo={handleSaveCustomerInfo}
          handleConfirmSignOut={handleConfirmSignOut}
        />
      )}
    </div>
  );
}
