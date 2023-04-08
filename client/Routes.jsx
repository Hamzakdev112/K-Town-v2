import React from "react";
import ExitFrame from "./ExitFrame";
import ActiveWebhooks from "./pages/debugCards/ActiveWebhooks";
import BillingAPI from "./pages/debugCards/BillingAPI";
import CalenderIndex from "./pages/CalenderIndex";
import DevNotes from "./pages/debugCards/DevNotes";
import GetData from "./pages/debugCards/GetData";
import Index from "./pages/Index";
import Orders from "./pages/Orders";

const routes = {
  "/": () => <Index />,
  "/exitframe": () => <ExitFrame />,
  //Routes
  "/calender": () => <CalenderIndex />,
  "/orders": () => <Orders />,
  //Add your routes here
};

export default routes;
