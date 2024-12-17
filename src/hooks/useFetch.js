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

  // const putData = (putData) => {
  //   setOptions({
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(putData),
  //   });
  // };

  const putData = async (putData) => {
    const setOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(putData),
    };

    try {
      setIsPending(true);
      const res = await fetch(url, setOptions);
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const responseData = await res.json();
      setData(responseData);
      setError(null);
      return responseData; // Explicitly return the updated data
    } catch (err) {
      console.error("PUT request failed:", err);
      setError(err.message || "Failed to update data");
      throw err; // Rethrow the error for the caller to handle
    } finally {
      setIsPending(false);
    }
  };


  useEffect(() => {
    console.log(`useFetch ran with url: ${url}, method: ${method}, options: ${JSON.stringify(options)}`);

    const controller = new AbortController();

    const fetchData = async (fetchOptions) => {
      setIsPending(true);

      try {
        const res = await fetch(url, { ...fetchOptions, signal: controller.signal });
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const data = await res.json();

        setIsPending(false);
        setData(data);
        setError(null);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("The fetch was aborted");
        } else {
          setIsPending(false);
          setError("Could not fetch the data");
        }
      }
    };

    if (method === "GET") {
      fetchData();
    } else if ((method === "POST" || method === "PUT") && options) {
      fetchData(options);
    }

    return () => {
      controller.abort();
    };
  }, [url, options, method]);

  return { data, isPending, error, postData, putData };
};
