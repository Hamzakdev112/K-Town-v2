import { useAppBridge } from "@shopify/app-bridge-react";
import { Layout, LegacyCard, Page } from "@shopify/polaris";
import { navigate } from "raviger";
import React from "react";
import GoogleCalendar from "../components/GoogleCalendar";

const CalenderIndex = () => {
  const app = useAppBridge();
  return (
    <Page
      title="Google Calender"
      subtitle="Interact and explore"
      breadcrumbs={[{ content: "Home", onAction: () => navigate("/") }]}
    >
      <Layout>
        <Layout.Section oneHalf>
          <GoogleCalendar />
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default CalenderIndex;
