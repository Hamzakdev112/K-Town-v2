import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import {
  Layout,
  LegacyCard,
  Page,
  Loading,
  Frame,
  SkeletonDisplayText

  } from "@shopify/polaris";
import { navigate } from "raviger";
import React, {useState,useCallback} from "react";
import {TextField} from '@shopify/polaris';
import '../styles/orderMutation.css'
import useFetch from "../hooks/useFetch";

const HomePage = () => {
  const [loading,setLoading] = useState(false)
  const fetch  = useFetch()
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  return (
    <Frame>
      {
        loading &&
        <Loading />
      }
    <Page title="Home">
      <Layout>

        <Layout.Section fullWidth>
          <LegacyCard
            title="Orders"

            sectioned
            primaryFooterAction={{
              content: "Go",
              onAction: ()=>{
                navigate("/orders")
              }
            }}
          >
            <p>
              Edit your orders
            </p>
            <div className="search-order-input">
  </div>



          </LegacyCard>
        </Layout.Section>

        <Layout.Section fullWidth>
          <LegacyCard
            title="Google Calender"
            sectioned
            primaryFooterAction={{
              content: "Explore",
              onAction: () => {
                navigate("/calender");
              },
            }}
            >
            <p>
            Track your orders here
            </p>
          </LegacyCard>
        </Layout.Section>
       </Layout>
    </Page>
              </Frame>
  );
};

export default HomePage;
