import { useAppBridge } from "@shopify/app-bridge-react";
import { Frame, Layout, LegacyCard, Loading, Page } from "@shopify/polaris";
import { navigate } from "raviger";
import React, { useEffect, useState } from "react";
import GoogleCalendar from "../components/GoogleCalendar";
import Order from "../components/Order";
import useFetch from "../hooks/useFetch";
import { fetchAllOrders } from "../apiCalls/ordersApis";
import { useDispatch, useSelector } from "react-redux";

const Orders = () => {
  const fetch  = useFetch()
  const app = useAppBridge();
  const dispatch = useDispatch()
  const {orders, isFetching:loading} = useSelector((state)=>state.orders)
    useEffect(()=>{
        fetchAllOrders(fetch,dispatch)
    }, [])
  return (
    <Frame>
        {
            loading &&
            <Loading />
        }
    <Page
    title="Orders"
    subtitle="Edit your orders here and send email to customer"
    breadcrumbs={[{ content: "Home", onAction: () => navigate("/") }]}
    >
      <Layout  >
        <Layout.Section>
            {
                orders &&
                <Order orders={orders} />
            }
        </Layout.Section>
      </Layout>
    </Page>
    </Frame>
  );
};

export default Orders;
