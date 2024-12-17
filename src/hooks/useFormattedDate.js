import React, { useState, useEffect } from "react";

const useFormattedDate = () => {
    const [dateData, setDateData] = useState({
        date: "",
        dayOfWeek: "",
        time: "",
    });

    useEffect( () => {
        const today = new Date();

        const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        const formattedTime = today.toLocaleString(undefined, {
            hour: "numeric",
            minute: "numeric",
        })

        //split the formatted time into components (hour, minute, AM/PM)
        const parts = formattedTime.split(/[:\s]+/);
        const time = `${parts[0]}:${parts[1]}:${parts[2]}`;

        setDateData({
            date: formattedDate,
            dayOfWeek: today.toLocaleString(undefined, { weekday: "long" }),
            time: time,
        });

        console.log('dateData:', dateData);

    }, []);

    return dateData;
};

export default useFormattedDate;