import React from "react";
import ExitFrame from "./ExitFrame";
import CalenderIndex from "./pages/CalenderIndex";
import Index from "./pages/Index";
import Orders from "./pages/Orders";
import CustomBookings from "./pages/CustomBookings";

const routes = {
  "/": () => <Index />,
  "/exitframe": () => <ExitFrame />,
  //Routes
  "/calender": () => <CalenderIndex />,
  "/orders": () => <Orders />,
  "/custom-bookings": () => <CustomBookings />,
  //Add your routes here
};

export default routes;
