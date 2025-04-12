import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
//custom-hooks
import { useFetch } from "../hooks/useFetch";

//components
import SignOutForm from "../components/sign-out/SignOutForm";

//images
import close from "../assets/close.svg";
import dollarSign from "../assets/icons/dollar-sign.svg";

export default function SignOut({ handleHideNavbar, setItemName, setItemSignOutSuccess, setItemSignOutFailure }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const url = `http://localhost:8000/inventory/${id}`;
  const { data: item, isPending, error } = useFetch(url);

  //customer info
  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Derive full name from first and last name
  const customerName = `${customerFirstName} ${customerLastName}`.trim();

  // Effect to handle the item data loading
  useEffect(() => {
    console.log('Item data:', item);
    console.log('Is pending:', isPending);
    console.log('Error:', error);

    // When the component unmounts, set hideNavbar to false
    return () => {
      if (handleHideNavbar) {
        handleHideNavbar();
      }
    };
  }, [handleHideNavbar, item, isPending, error]);

  // Function to process the form submission with item data
  const processFormSubmission = async (itemData) => {
    // Validate form
    if (!customerFirstName || !customerLastName || !customerEmail || !customerPhone) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create log entry for the sign-out action
      const signOutFormData = {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        action: "OUT",
        barcode: itemData.barcode || 'Unknown',
      };

      // Log the sign-out data
      console.log(signOutFormData);

      // Update the item status to OUT
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...itemData,
          status: "OUT"
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update item status');
      }

      // Set the item name for the banner notification
      if (setItemName) {
        setItemName(itemData.name);
      }

      // Show success notification
      if (setItemSignOutSuccess) {
        setItemSignOutSuccess(true);
      }

      // Navigate back to inventory page
      navigate('/');

    } catch (error) {
      console.error('Error updating item status:', error);
      if (setItemSignOutFailure) {
        setItemSignOutFailure(true);
      }
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async (e) => {
    e.preventDefault();

    // Check if item data is loaded
    if (!item && !isPending) {
      // Try to fetch the item data directly
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch item data');
        }
        const itemData = await response.json();
        console.log('Fetched item data directly:', itemData);

        // Continue with the form submission using the fetched data
        processFormSubmission(itemData);
      } catch (error) {
        console.error('Error fetching item data:', error);
        setFetchError('Could not load item data. Please try again.');
        alert('Could not load item data. Please try again.');
      }
      return;
    }

    // If item data is available, process the form
    if (item) {
      processFormSubmission(item);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between p-6 shadow-lg">
        <h1>Sign Item Out</h1>
        <NavLink to="/" onClick={() => handleHideNavbar && handleHideNavbar()}>
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
        <div className="col-span-5 col-start-4 mt-12 mb-6">
          <SignOutForm
            setCustomerFirstName={setCustomerFirstName}
            setCustomerLastName={setCustomerLastName}
            setCustomerEmail={setCustomerEmail}
            setCustomerPhone={setCustomerPhone}
            url={url}
            handleSignOut={handleSignOut}
          />
        </div>
      </div>
    </div>
  );
}
