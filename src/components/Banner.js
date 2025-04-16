import { useState, useEffect } from "react";

import { ReactComponent as InfoAlert } from "../assets/icons/alert/info.svg";
import { ReactComponent as SuccessAlert } from "../assets/icons/alert/success.svg";
import { ReactComponent as FailureAlert } from "../assets/icons/alert/failure.svg";


export default function Banner({ message, type }) {
  const styles = {
    success: "bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300",
    failure: "bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300",
    updateSuccess: "bg-indigo-100 dark:bg-indigo-900 border border-indigo-400 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300",
  };
  const [icon, setIcon] = useState();
  useEffect(() => {
    switch (type) {
      case "success":
        setIcon(<SuccessAlert className="h-6 w-6 shrink-0 stroke-current mr-2" />);
        break;
      case "failure":
        setIcon(<FailureAlert className="h-6 w-6 shrink-0 stroke-current mr-2" />);
        break;
      case "updateSuccess":
        setIcon(<InfoAlert className="h-6 w-6 shrink-0 stroke-current mr-2" />);
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
      className={`flex items-center px-4 py-3 rounded mb-4 absolute top-4 left-1/2 transform -translate-x-1/2 w-1/3 z-20 ${styles[type]}`}
    >
      {icon}
      <span>{message}</span>
    </div>
  );
}
