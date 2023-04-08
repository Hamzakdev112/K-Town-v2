import { useAppBridge } from "@shopify/app-bridge-react";
import { Frame, Layout, LegacyCard, Loading, Page } from "@shopify/polaris";
import { navigate } from "raviger";
import React, { useEffect, useState } from "react";
import GoogleCalendar from "../components/GoogleCalendar";
import Order from "../components/Order";
import useFetch from "../hooks/useFetch";

const Orders = () => {
  const fetch  = useFetch()
  const app = useAppBridge();
    const [orders, setOrders] = useState(null)
    const [loading, setLoading] = useState(false)
    const fetchOrders = async ()=>{
        try{
            setLoading(true)
            const response = await fetch("orders/all")
            const data = await response.json()
            setOrders(data)
            setLoading(false)
        }catch(err){
            setLoading(false)
            console.log(err)
        }
    }


    useEffect(()=>{
        fetchOrders()
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
