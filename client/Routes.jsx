import React from "react";
import ExitFrame from "./ExitFrame";
import ActiveWebhooks from "./pages/debugCards/ActiveWebhooks";
import BillingAPI from "./pages/debugCards/BillingAPI";
import CalenderIndex from "./pages/CalenderIndex";
import DevNotes from "./pages/debugCards/DevNotes";
import GetData from "./pages/debugCards/GetData";
import Index from "./pages/Index";

const routes = {
  "/": () => <Index />,
  "/exitframe": () => <ExitFrame />,
  //Debug Cards
  "/debug": () => <CalenderIndex />,
  "/debug/activeWebhooks": () => <ActiveWebhooks />,
  "/debug/getData": () => <GetData />,
  "/debug/billing": () => <BillingAPI />,
  "/debug/devNotes": () => <DevNotes />,
  "/debug/calender": () => <Calender />,
  //Add your routes here
};

export default routes;
