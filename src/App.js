import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Pages
import EditItem from "./pages/EditItem";

import Checkout from "./pages/Checkout";
import InventoryPage from "./pages/InventoryPage";
import SingleItemInfo from "./pages/ItemInfo";
import ItemManagement from "./pages/ItemManagement";

//
import AddItemPage from "./pages/AddItemPage";

import SignOut from "./pages/SignOut";
import Logs from "./pages/Logs";
// Components
import Navbar from "./ui/Navbar";
import Banner from "./components/Banner";
import PrintPreview from "./components/PrintPreview";
import CategoryManagement from "./pages/CategoryManagement";
import CustomerManagement from "./pages/CustomerManagement";
import TestLogEndpoint from "./pages/TestLogEndpoint";
import TestCustomersEndpoint from "./pages/TestCustomersEndpoint";
import CustomerInventoryView from "./pages/CustomerInventoryView";
import SystemSettings from "./pages/SystemSettings";
import ImportCustomers from "./pages/ImportCustomers";

// Import print styles
import "./styles/printPreview.css";
import SingleItemLogInformation from "./pages/SingleItemLogInformation";
// Banner Components

function App() {
  // Banners
  const [bannerType, setBannerType] = useState(""); // success, failure, updateSuccess
  const [bannerMessage, setBannerMessage] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemCreationSuccess, setItemCreationSuccess] = useState(false);
  const [itemCreationFailure, setItemCreationFailure] = useState(false);
  const [itemUpdateSuccess, setItemUpdateSuccess] = useState(false);
  const [itemUpdateFailure, setItemUpdateFailure] = useState(false);
  const [itemSignInSuccess, setItemSignInSuccess] = useState(false);
  const [itemSignInFailure, setItemSignInFailure] = useState(false);
  const [itemSignOutSuccess, setItemSignOutSuccess] = useState(false);
  const [itemSignOutFailure, setItemSignOutFailure] = useState(false);
  const [itemDeleteSuccess, setItemDeleteSuccess] = useState(false);
  const [itemDeleteFailure, setItemDeleteFailure] = useState(false);

  // hide navbar for select pages
  const location = useLocation();
  // const hideNavbar = location.pathname.includes("/sign-out");

  // new boolean hide nvabar for select pages
  const [hideNavbar, setHideNavbar] = useState(false);

  const handleHideNavbar = () => {
    setHideNavbar(false);
  };

  //useEffect to hide navbar on select pages
  useEffect(() => {
    // Hide navbar on specific pages
    if (location.pathname.includes("/sign-out") ||
        location.pathname.includes("/add-item") ||
        location.pathname.includes("/categories/manage") ||
        location.pathname.includes("/customers/manage") ||
        location.pathname.includes("/system-settings") ||
        location.pathname.includes("/import-customers") ||
        (location.pathname.includes("/inventory/") && location.pathname.includes("/edit")) ||
        (location.pathname.includes("/inventory/") && location.pathname.includes("/print"))) {
      console.log('Setting hideNavbar to true for:', location.pathname);
      setHideNavbar(true);
    } else {
      // For other pages, show the navbar
      setHideNavbar(false);
    }
  }, [location.pathname]);
  useEffect(() => {
    if (itemCreationSuccess) {
      setBannerType("success");
      setBannerMessage(
        "Your item has been created and added to your inventory."
      );
    }
    if (itemCreationFailure) {
      setBannerType("failure");
      setBannerMessage(
        "There was a problem creating your item. Please try again."
      );
    }
    if (itemUpdateSuccess) {
      setBannerType("updateSuccess");
      setBannerMessage(`${itemName} has been updated successfully.`);
    }
    if (itemUpdateFailure) {
      setBannerType("failure");
      setBannerMessage(
        `There was a problem updating ${itemName}. Please try again.`
      );
    }
    if (itemSignInSuccess) {
      setBannerType("success");
      setBannerMessage(`${itemName} has been signed in successfully.`);
    }
    if (itemSignInFailure) {
      setBannerType("failure");
      setBannerMessage(
        `There was a problem signing in ${itemName}. Please try again.`
      );
    }
    if (itemSignOutSuccess) {
      setBannerType("success");
      setBannerMessage(`${itemName} has been signed out successfully.`);
    }
    if (itemSignOutFailure) {
      setBannerType("failure");
      setBannerMessage(
        `There was a problem signing out ${itemName}. Please try again.`
      );
    }
    if (itemDeleteSuccess) {
      setBannerType("success");
      setBannerMessage(`${itemName} has been deleted successfully.`);
    }
    if (itemDeleteFailure) {
      setBannerType("failure");
      setBannerMessage(
        `There was a problem deleting ${itemName}. Please try again.`
      );
    }

    const timer = setTimeout(() => {
      if (
        itemCreationSuccess ||
        itemCreationFailure ||
        itemUpdateSuccess ||
        itemUpdateFailure ||
        itemSignInSuccess ||
        itemSignInFailure ||
        itemSignOutSuccess ||
        itemSignOutFailure ||
        itemDeleteSuccess ||
        itemDeleteFailure
      ) {
        setItemCreationSuccess(false);
        setItemCreationFailure(false);
        setItemUpdateSuccess(false);
        setItemUpdateFailure(false);
        setItemSignInSuccess(false);
        setItemSignInFailure(false);
        setItemSignOutSuccess(false);
        setItemSignOutFailure(false);
        setItemDeleteSuccess(false);
        setItemDeleteFailure(false);
        setBannerType("");
        setBannerMessage("");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [
    itemCreationSuccess,
    itemCreationFailure,
    itemUpdateSuccess,
    itemUpdateFailure,
    itemSignInSuccess,
    itemSignInFailure,
    itemSignOutSuccess,
    itemSignOutFailure,
    itemDeleteSuccess,
    itemDeleteFailure,
    itemName,
  ]);

  return (
    <div className="bg-slate-100 dark:bg-gray-900 min-h-screen">
      {!hideNavbar && <Navbar />}
      <div className="relative w-full">
        {/* Display banners for appropriate CRUD operation */}
        {bannerMessage && <Banner message={bannerMessage} type={bannerType} />}

        <Routes>
          <Route path="/" element={<InventoryPage
            setItemName={setItemName}
            setItemSignInSuccess={setItemSignInSuccess}
            setItemSignInFailure={setItemSignInFailure}
            setItemSignOutSuccess={setItemSignOutSuccess}
            setItemSignOutFailure={setItemSignOutFailure}
          />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/add-item"
            element={
              <AddItemPage
                setItemCreationSuccess={setItemCreationSuccess}
                setItemCreationFailure={setItemCreationFailure}
                handleHideNavbar={handleHideNavbar}
              />
            }
          />
          <Route path="/logs" element={<Logs />} />
          <Route path="/logs/:id" element={<SingleItemLogInformation setHideNavbar={setHideNavbar} />} />
          <Route
            path="/inventory/:id"
            element={<SingleItemInfo setHideNavbar={setHideNavbar} />}
          />
          <Route
            path="/inventory/:id/edit"
            element={
              <EditItem
                setItemName={setItemName}
                setItemUpdateSuccess={setItemUpdateSuccess}
                setItemUpdateFailure={setItemUpdateFailure}
                setItemDeleteSuccess={setItemDeleteSuccess}
                setItemDeleteFailure={setItemDeleteFailure}
              />
            }
          />
          <Route path="/:id/sign-out" element={<SignOut
            handleHideNavbar={handleHideNavbar}
            setItemName={setItemName}
            setItemSignOutSuccess={setItemSignOutSuccess}
            setItemSignOutFailure={setItemSignOutFailure}
          />} />
          <Route path="/item-management" element={<ItemManagement />} />
          <Route path="/inventory/:id/print" element={<PrintPreview />} />
          <Route path="/categories/manage" element={<CategoryManagement />} />
          <Route path="/customers/manage" element={<CustomerManagement />} />
          <Route path="/logs/:id" element={<SingleItemLogInformation />} />
          <Route path="/test-logs" element={<TestLogEndpoint />} />
          <Route path="/test-customers" element={<TestCustomersEndpoint />} />
          <Route path="/customer-inventory" element={<CustomerInventoryView />} />
          <Route path="/system-settings" element={<SystemSettings />} />
          <Route path="/import-customers" element={<ImportCustomers />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
