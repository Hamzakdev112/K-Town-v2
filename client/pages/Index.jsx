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
  const [orderId, setOrderId] = useState('');
  const [order,setOrder] = useState(null)
  const [loading,setLoading] = useState(false)
  console.log(order)
  const fetch  = useFetch()
const handleSearch = async()=>{
  try{
    setLoading(true)
    const res = await fetch(`/api/order/${orderId}`); //fetch instance of useFetch()
    const response = await res.json()
    setOrder(response.body.data.order)
    setLoading(false)
  }catch(err){
    console.log(err)
  }
}

  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const handleChange = useCallback((newValue) => setOrderId(newValue),[],);
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
            title="Booking Mutation"

            sectioned
            primaryFooterAction={{
              content: "Get",
              onAction: handleSearch
            }}
          >
            <p>
              You can cancel a booking by using this form
            </p>
            <div style={{marginBottom:"20px"}} className="search-order-input">
            <TextField

      label=""
      placeholder="Enter order id here"
      value={orderId}
      onChange={handleChange}
      autoComplete="off"
    />
  </div>
  {
    loading ?<SkeletonDisplayText size="small" /> :
    order &&
  <div>
      {order.lineItems.edges[0].node.customAttributes.map((att)=>(
        <div style={{display:'flex', gap:"10px"}}>
        <span>{att.key}</span>
        <span>{att.value}</span>
        </div>
      ))}
    </div>
    }
    {
    order &&
      <span>{order.lineItems.edges[0].node.id}</span>
    }



          </LegacyCard>
        </Layout.Section>

        <Layout.Section fullWidth>
          <LegacyCard
            title="Debug Cards"
            sectioned
            primaryFooterAction={{
              content: "Debug Cards",
              onAction: () => {
                navigate("/debug");
              },
            }}
            >
            <p>
              Explore how the repository handles data fetching from the backend,
              App Proxy, making GraphQL requests, Billing API and more.
            </p>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section oneHalf>
          <LegacyCard
            sectioned
            title="Repository"
            primaryFooterAction={{
              content: "GitHub",
              onAction: () => {
                redirect.dispatch(Redirect.Action.REMOTE, {
                  url: "https://github.com/kinngh/shopify-node-express-mongodb-app",
                  newContext: true,
                });
              },
            }}
            secondaryFooterActions={[
              {
                content: "Open Issue",
                onAction: () => {
                  redirect.dispatch(Redirect.Action.REMOTE, {
                    url: "https://github.com/kinngh/shopify-node-express-mongodb-app/issues?q=is%3Aissue",
                    newContext: true,
                  });
                },
              },
            ]}
          >
            <p>Star the repository, open a new issue or start a discussion.</p>
          </LegacyCard>
          <LegacyCard
            sectioned
            title="Changelog"
            primaryFooterAction={{
              content: "Explore",
              onAction: () => {
                redirect.dispatch(Redirect.Action.REMOTE, {
                  url: "https://shopify.dev/changelog/",
                  newContext: true,
                });
              },
            }}
          >
            <p>Explore changelog on Shopify.dev and follow updates.</p>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section oneHalf>
          <LegacyCard
            sectioned
            title="Documentation"
            primaryFooterAction={{
              content: "Explore APIs",
              onAction: () => {
                redirect.dispatch(Redirect.Action.REMOTE, {
                  url: "https://shopify.dev/graphiql/admin-graphiql",
                  newContext: true,
                });
              },
            }}
            secondaryFooterActions={[
              {
                content: "Design Guidelines",
                onAction: () => {
                  redirect.dispatch(Redirect.Action.REMOTE, {
                    url: "https://shopify.dev/apps/design-guidelines",
                    newContext: true,
                  });
                },
              },
            ]}
          >
            <p>
              Explore the GraphQL APIs in Graphiql or read design guidelines.
            </p>
          </LegacyCard>
          <LegacyCard
            sectioned
            title="Hiring?"
            primaryFooterAction={{
              content: "Twitter",
              onAction: () => {
                redirect.dispatch(Redirect.Action.REMOTE, {
                  url: "https://www.twitter.com/kinngh",
                  newContext: true,
                });
              },
            }}
            secondaryFooterActions={[
              {
                content: "LinkedIn",
                onAction: () => {
                  redirect.dispatch(Redirect.Action.REMOTE, {
                    url: "https://www.linkedin.com/in/theharshdeep/",
                    newContext: true,
                  });
                },
              },
            ]}
          >
            <p>🌎 / 🇨🇦 and looking to expand your engineering team?</p>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section fullWidth>
          <LegacyCard
            sectioned
            title="Developer Notes"
            primaryFooterAction={{
              content: "Read More",
              onAction: () => {
                navigate("/debug/devNotes");
              },
            }}
          >
            <p>
              Read notes on opening an issue, creating App Extensions and more.
            </p>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
              </Frame>
  );
};

export default HomePage;
