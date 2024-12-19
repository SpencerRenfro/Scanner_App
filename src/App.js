import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

//firestore imports
import { projectFirestore } from "./firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase/config";


// Pages

//new edit page
import EditItemPage from "./pages/EditItemPage";

import InventoryPage from "./pages/InventoryPage";
import BarcodePage from "./pages/BarcodePage";
import AddItemPage from "./pages/AddItemPage";
import SignOut from "./pages/SignOut";
import Logs from "./pages/Logs";
// Components
import Navbar from "./ui/Navbar";
import Banner from "./components/Banner";
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

  // hide navbar for select pages
  const location = useLocation();
  // const hideNavbar = location.pathname.includes("/sign-out");

  // new boolean hide nvabar for select pages
  const [hideNavbar, setHideNavbar] = useState(false);

  const handleHideNavbar = () => {
    setHideNavbar(false);
  };

//useEffect for hiding navbar on select pages
  useEffect(() => {
    console.log('location.pathname:', location.pathname);
    if (location.pathname.startsWith("/add-item") || location.pathname.startsWith("/inventory/")
       || location.pathname.endsWith("/sign-out") ) {
      console.log('add-item or inventory or sign-out');
      console.log('location.pathname:', location.pathname);
      setHideNavbar(true);
    } else {
      console.log('false');
      console.log('location.pathname:', location.pathname);
      setHideNavbar(false);
    }
  }, [location.pathname, hideNavbar]);

  // banner types useEffect
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

    const timer = setTimeout(() => {
      if (
        itemCreationSuccess ||
        itemCreationFailure ||
        itemUpdateSuccess ||
        itemUpdateFailure ||
        itemSignInSuccess ||
        itemSignInFailure ||
        itemSignOutSuccess ||
        itemSignOutFailure
      ) {
        setItemCreationSuccess(false);
        setItemCreationFailure(false);
        setItemUpdateSuccess(false);
        setItemUpdateFailure(false);
        setItemSignInSuccess(false);
        setItemSignInFailure(false);
        setItemSignOutSuccess(false);
        setItemSignOutFailure(false);
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
    itemName,
  ]);

    // fetching data from firestore
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [inventory, setInventory] = useState(null);
  
    const getInventory = async () => {
      setIsPending(true);
      setError(null);
  
      try {
        const querySnapshot = await getDocs(collection(db, "inventory"));
  
        if (querySnapshot.empty) {
          setError("No products in Inventory");
          setIsPending(false);
        } else {
          let results = [];
          querySnapshot.forEach((doc) => {
            console.log("doc:", doc);
            results.push({ id: doc.id, ...doc.data() });
          });
          setInventory(results);
          setIsPending(false);
        }
      } catch (err) {
        setError(err.message);
        setIsPending(false);
      }
    };
  
    useEffect(() => {
      getInventory();
    }, []);

  return (
    <div className="bg-slate-100 min-h-screen ">
      {!hideNavbar && <Navbar />}
      <div className="relative w-full">
        {/* Display banners for appropriate CRUD operation */}
        {bannerMessage && <Banner message={bannerMessage} type={bannerType} />}

        <Routes>
          <Route path="/" element={<InventoryPage />} />
          <Route
            run
            json-server
            path="/add-item"
            element={
              <AddItemPage
                setItemCreationSuccess={setItemCreationSuccess}
                setItemCreationFailure={setItemCreationFailure}
                handleHideNavbar={handleHideNavbar}
                setHideNavbar={setHideNavbar}
              />
            }
          />
          <Route path="/logs" element={<Logs />} />
          <Route path="/inventory/:id" element={<BarcodePage />} />
          <Route
            path="/inventory/:id/editItemPage"
            element={
              <EditItemPage
                setItemUpdateSuccess={setItemUpdateSuccess}
                setItemUpdateFailure={setItemUpdateFailure}
                setItemName={setItemName}
              />
            }
          />
          <Route
            path="/:id/sign-out"
            element={
              <SignOut
                setHideNavbar={setHideNavbar}
                handleHideNavbar={handleHideNavbar}
                setItemSignOutSuccess={setItemSignOutSuccess}
                setItemSignOutFailure={setItemSignOutFailure}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;


