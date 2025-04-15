import { useState, useEffect } from "react";

export const useFetch = (url, method = "GET") => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState(null);

  const postData = (postData) => {
    setOptions({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
  };

  const putData = (putData) => {
    setOptions({
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(putData),
    });
  };

  const deleteData = () => {
    setOptions({
      method: "DELETE",
    });
  };

  useEffect(() => {
    console.log(`useFetch ran with url: ${url}, method: ${method}, options:`, options);

    const controller = new AbortController();

    const fetchData = async (fetchOptions) => {
      setIsPending(true);

      try {
        console.log(`Making ${method} request to ${url} with options:`, fetchOptions);
        const res = await fetch(url, { ...fetchOptions, signal: controller.signal });

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`Error response from ${url}:`, errorText);
          throw new Error(res.statusText || `HTTP error ${res.status}`);
        }

        const data = await res.json();
        console.log(`Successful ${method} response from ${url}:`, data);

        setIsPending(false);
        setData(data);
        setError(null);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("The fetch was aborted");
        } else {
          console.error(`Error in ${method} request to ${url}:`, err);
          setIsPending(false);
          setError(`Could not fetch the data: ${err.message}`);
        }
      }
    };

    if (method === "GET") {
      fetchData();
    } else if ((method === "POST" || method === "PUT" || method === "DELETE") && options) {
      fetchData(options);
    }

    return () => {
      controller.abort();
    };
  }, [url, options, method]);

  return { data, isPending, error, postData, putData, deleteData };
};
