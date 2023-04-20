import { useAppBridge } from "@shopify/app-bridge-react";
import { Button, Frame, Layout, LegacyCard, Loading, Page, TextField } from "@shopify/polaris";
import { navigate } from "raviger";
import React from "react";
import useFetch from "../hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import '../styles/custombookings.css'
import Products from "../components/customBookings/Products";

const CustomBookings = () => {
  const fetch  = useFetch()
  const app = useAppBridge();
  const dispatch = useDispatch()
  const {orders, isFetching:loading} = useSelector((state)=>state.orders)
  return (
    <Frame>
        {
            loading &&
            <Loading />
        }
    <Page
    title="Custom Bookings"
    breadcrumbs={[{ content: "Home", onAction: () => navigate("/") }]}
    >
      <Layout >
        <Products />
      </Layout>
    </Page>
    </Frame>
  );
};

export default CustomBookings;
