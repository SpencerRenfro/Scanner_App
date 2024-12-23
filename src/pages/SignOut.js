import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
// Components
import SaveCustomerModal from "../components/sign-out/SaveCustomerModal";
import SignOutForm from "../components/sign-out/SignOutForm";
import ReturningCustomerSignout from "../components/sign-out/ReturningCustomerSignout";
// Images
import close from "../assets/icons/close.svg";
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

  // GET Requests
  const { data: item, isPending, error } = useFetch(url + `inventory/${id}`);
  const {
    data: customerList,
    CustomerListIsPending,
    customerListError,
  } = useFetch(url + "customers");

  // PUT Requests
  const { putData: putItemOut, error:putItemError } = useFetch(url + `inventory/${id}`, "PUT");

  // POST Requests
  const { postData: newCustomerPost } = useFetch(url + "customers", "POST");
  const { postData: signOutReceiptPost } = useFetch(url + "itemLogs", "POST");

  const [returningCustomer, setReturningCustomer] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({});
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveCustomerInfoChecked, setSaveCustomerInfoChecked] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const getReturningCustomerData = (e) => {
    const customerName = e.target.value;
    for (let i = 0; i < customerList.length; i++) {
      if (customerList[i].fullName === customerName) {
        setFormData({
          firstName: customerList[i].firstName,
          lastName: customerList[i].lastName,
          email: customerList[i].email,
          phone: customerList[i].phone,
        });
        break;
      }
    }
  };

  const handleSaveCustomerInfo = async () => {
    const customerData = {
      ...newCustomerData,
      ...formData,
      fullName: `${formData.firstName} ${formData.lastName}`,
      barcode: Math.floor(Math.random() * 1e8) + formData.lastName,
    };
    await newCustomerPost(customerData);
    setShowSaveModal(false);
  };

  const handleReceiptLog = async () => {
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
    await signOutReceiptPost(signOutReceipt);
  };

  const handleSignItemOut = async () => {
    const updatedItem = { ...item, status: "OUT" };
    try {
      const response = await putItemOut(updatedItem);
      console.log("Item signed out successfully:", response);
    } catch(err){
      console.error("Error signing item out:", err);
    }
  };

  const handleConfirmSignOut = async () => {
    try {
      if (saveCustomerInfoChecked) await handleSaveCustomerInfo();
      await handleSignItemOut();
      await handleReceiptLog();
      setItemSignOutSuccess(true);
      navigate("/");
    } catch (error) {
      console.error("Error during sign-out process:", error);
      setItemSignOutFailure(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (returningCustomer) handleConfirmSignOut();
    else setShowSaveModal(true);
  };

  useEffect(() => {
    console.log("customerList:", customerList);
  }, [customerList]);

  return (
    <div>
      {error && <div>Item error: {error}</div>}
      {isPending && <div>Loading...</div>}
      {customerListError && <div>Customer List error: {customerListError}</div>}
      <div className="flex items-center justify-between p-6 shadow-lg">
        <h1>Sign Item Out</h1>
        <NavLink to="/" onClick={handleHideNavbar}>
          <img src={close} width={25} alt="close" />
        </NavLink>
      </div>
      {item && (
        <div className="grid grid-cols-12 mt-10">
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
          <div className="col-start-4 col-span-5 gap-5">
            <input
              type="checkbox"
              placeholder="Returning Customer?"
              onClick={() => setReturningCustomer(!returningCustomer)}
            />
            <label>Returning Customer?</label>
          </div>
          {returningCustomer ? (
            <ReturningCustomerSignout
              customerList={customerList || []}
              getReturningCustomerData={getReturningCustomerData}
            />
          ) : (
            <div className="col-span-5 col-start-4 mt-12 mb-6">
              <SignOutForm
                handleInputChange={handleInputChange}
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
      )}
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
