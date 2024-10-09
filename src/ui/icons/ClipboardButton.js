import React, { useState } from "react";

export default function CopyToClipboardButton(props) {
  const [copySuccess, setCopySuccess] = useState("");

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(props.barcode);
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      setCopySuccess("Failed to copy!");
    }
  };

  return (
    <div className="  flex flex-row">
      <div className="">
        <button
          onClick={copyToClipboard}
          className=" text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="-5.0 -10.0 110.0 135.0"
            height="30px"
            className="fill-slate-900 dark:fill-slate-200"
          >
            <path d="m91.738 42.008-10.312-10.312c-1.9414-1.9414-4.6211-3.0508-7.3633-3.0508h-18.855c-5.7461 0-10.418 4.6719-10.418 10.418v43.75c0 5.7461 4.6719 10.418 10.418 10.418h29.168c5.7461 0 10.418-4.6719 10.418-10.418v-33.438c0-2.7422-1.1094-5.4258-3.0508-7.3633zm-15.176-6.1914c0.14453 0.10938 0.32031 0.16797 0.44922 0.29688l10.312 10.312c0.12891 0.12891 0.1875 0.30469 0.29688 0.44922h-6.8906c-2.3008 0-4.168-1.8672-4.168-4.168zm11.98 46.992c0 2.3008-1.8672 4.168-4.168 4.168h-29.168c-2.3008 0-4.168-1.8672-4.168-4.168v-43.75c0-2.3008 1.8672-4.168 4.168-4.168h15.105v7.8125c0 5.7461 4.6719 10.418 10.418 10.418h7.8125zm-43.75-55.203c0 1.7266-1.3984 3.125-3.125 3.125h-16.668c-1.7266 0-3.125-1.3984-3.125-3.125 0-1.7266 1.3984-3.125 3.125-3.125h16.668c1.7266 0 3.125 1.3984 3.125 3.125zm-28.125 46.875h22.918v6.25h-22.918c-6.3203 0-11.457-5.1406-11.457-11.457l-0.003907-45.836c0-6.3203 5.1406-11.457 11.457-11.457h8.9531c1.2383-3.0508 4.2188-5.207 7.7148-5.207 3.4961 0 6.4766 2.1562 7.7148 5.207h8.9531c6.3203 0 11.457 5.1406 11.457 11.457h-6.25c0-2.8711-2.3359-5.207-5.207-5.207h-33.332c-2.8711 0-5.207 2.3359-5.207 5.207v45.832c0 2.8711 2.3359 5.207 5.207 5.207z" />
          </svg>
        </button>
      </div>
      <div>
        {copySuccess && (
          <div className="absolute  mt-2 text-green-500">{copySuccess}</div>
        )}
      </div>
    </div>
  );
}
