import { response } from "express";

   const datePicker = document.getElementById('datePicker');

    function getNextDay() {
        const today = new Date();
        const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        return tomorrow;
    }

    function getMaxDate() {
        const nextDay = getNextDay();
        const maxDate = new Date(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate() + 30);
        return maxDate;
    }

    flatpickr(datePicker, {
        minDate: getNextDay(),
        maxDate: getMaxDate(),
        dateFormat: "Y-m-d",
        disableMobile: true,
    });






