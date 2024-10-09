import { useState, useEffect } from "react";
import { useFetch } from "./useFetch";

export const useFindItem = (barcode, isSubmitted) => {

    const [singleItem, setSingleItem] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);

    const { data } = useFetch(`http://localhost:8000/inventory`);

    useEffect(() => {
        console.log("useFindItem ran, with barcode:", barcode);

        setIsPending(true);
        if (data) {
            console.log('data', data);
            const foundItem = data.find((item) => item.barcode === barcode);
            if (foundItem) {
                setSingleItem(foundItem);
                setIsPending(false);
                setError(null);
            } else {
                setIsPending(false);
                if(isSubmitted && !foundItem){
                    setError("Item not found");
                }

            }
        }
    }, [barcode, data]);



  return {singleItem, isPending, error}
};


