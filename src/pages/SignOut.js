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
  const [saveCustomer, setSaveCustomer] = useState(false);

  // For debugging - log when customer info changes
  useEffect(() => {
    if (customerFirstName || customerLastName || customerEmail || customerPhone) {
      console.log('Customer info updated:', {
        firstName: customerFirstName,
        lastName: customerLastName,
        email: customerEmail,
        phone: customerPhone
      });
    }
  }, [customerFirstName, customerLastName, customerEmail, customerPhone]);

  // Derive full name from first and last name
  const customerName = `${customerFirstName} ${customerLastName}`.trim();

  // Effect to handle the item data loading
  useEffect(() => {
    console.log('Item data:', item);
    console.log('Is pending:', isPending);
    console.log('Error:', error);
  }, [item, isPending, error]);

  // Function to process the form submission with item data
  const processFormSubmission = async (itemData) => {
    // Validate form
    if (!customerFirstName || !customerLastName || !customerEmail || !customerPhone) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current date and time for the log
      const now = new Date();
      const dateString = now.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
      const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });

      // Create log entry for the sign-out action
      const logEntry = {
        id: `${itemData.barcode}_${itemData.name}`,
        name: itemData.name,
        action: "OUT",
        date: dateString,
        barcode: itemData.barcode || 'Unknown',
        dayOfWeek: dayOfWeek,
        time: timeString,
        category: itemData.category || ''
      };

      // Log the sign-out data
      console.log('Creating log entry:', logEntry);

      // Post the log entry to the itemLogs collection
      const logResponse = await fetch('http://localhost:8000/itemLogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logEntry)
      });

      if (!logResponse.ok) {
        console.error('Failed to create log entry');
      }

      // Save customer if checkbox is checked
      if (saveCustomer) {
        try {
          // Check if customer already exists by email
          const customersResponse = await fetch('http://localhost:8000/customers');
          const existingCustomers = await customersResponse.json();

          const customerExists = existingCustomers.some(
            customer => customer.email.toLowerCase() === customerEmail.toLowerCase()
          );

          if (!customerExists) {
            // Create a new customer object
            const newCustomer = {
              firstName: customerFirstName,
              lastName: customerLastName,
              email: customerEmail,
              phone: customerPhone
            };

            // Post the new customer to the customers endpoint
            const saveCustomerResponse = await fetch('http://localhost:8000/customers', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(newCustomer)
            });

            if (!saveCustomerResponse.ok) {
              console.error('Failed to save customer');
            } else {
              console.log('Customer saved successfully');
            }
          } else {
            console.log('Customer already exists, not saving');
          }
        } catch (err) {
          console.error('Error saving customer:', err);
        }
      }

      // Create customer info object
      const customerInfo = {
        firstName: customerFirstName,
        lastName: customerLastName,
        email: customerEmail,
        phone: customerPhone,
        fullName: `${customerFirstName} ${customerLastName}`.trim()
      };

      // Update the item status to OUT and include customer info
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...itemData,
          status: "OUT",
          signedOutTo: customerInfo,
          lastUpdated: new Date().toISOString()
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
    <div className="bg-slate-100 dark:bg-gray-900 min-h-screen">
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
          <div>
            <SignOutForm
              setCustomerFirstName={setCustomerFirstName}
              setCustomerLastName={setCustomerLastName}
              setCustomerEmail={setCustomerEmail}
              setCustomerPhone={setCustomerPhone}
              customerFirstName={customerFirstName}
              customerLastName={customerLastName}
              customerEmail={customerEmail}
              customerPhone={customerPhone}
              url={url}
              handleSignOut={handleSignOut}
            />
            <div className="flex items-center mt-4 mb-2">
              <input
                type="checkbox"
                id="saveCustomer"
                checked={saveCustomer}
                onChange={() => setSaveCustomer(!saveCustomer)}
                className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
              />
              <label htmlFor="saveCustomer" className="ml-2 block text-sm leading-5 text-gray-700">
                Save customer information for future sign-outs
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
