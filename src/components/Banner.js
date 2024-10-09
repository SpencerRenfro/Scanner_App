import { useState, useEffect } from "react";

import { ReactComponent as InfoAlert } from "../assets/icons/alert/info.svg";
import { ReactComponent as SuccessAlert } from "../assets/icons/alert/success.svg";
import { ReactComponent as FailureAlert } from "../assets/icons/alert/failure.svg";


export default function Banner({ message, type }) {
  const styles = {
    success: "border-green-600",
    failure: "border-red-600",
    updateSuccess: "border-blue-600",
  };
  const [icon, setIcon] = useState();
  useEffect(() => {
    switch (type) {
      case "success":
        setIcon(<SuccessAlert className="h-6 w-6 shrink-0 stroke-current" />);
        break;
      case "failure":
        setIcon(<FailureAlert className="h-6 w-6 shrink-0 stroke-current" />);
        break;
      case "updateSuccess":
        setIcon(<InfoAlert className="h-6 w-6 shrink-0 stroke-current" />);
        console.log("updateSuccess");
        break;
      default:
        setIcon(null);
        break;
    }
  }, [type]);
  
  return (
    <div
      role="alert"
      className={`alert absolute top-[-10px]  left-1/2 transform -translate-x-1/2 w-1/3 z-20 rounded ${styles[type]} bg-inherit`}
      style={{ borderWidth: "3px" }}
    >
      {icon}
      <span>{message}</span>
    </div>
  );
}
