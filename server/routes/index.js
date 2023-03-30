import { Router } from "express";
import clientProvider from "../../utils/clientProvider.js";
import subscriptionRoute from "./recurringSubscriptions.js";

const userRoutes = Router();
userRoutes.use(subscriptionRoute);

userRoutes.get("/api", (req, res) => {
  const sendData = { text: "This is coming from /apps/api route." };
  res.status(200).json(sendData);
});

userRoutes.post("/api", (req, res) => {
  res.status(200).json(req.body);
});

userRoutes.get("/api/order/:orderId", async (req, res) => {
  try{

    //false for offline session, true for online session
    const {orderId}  = req.params
  const { client } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: false,
  });

  const order = await client.query({
    data: `{
      order(id: "gid://shopify/Order/${orderId}") {
        lineItems(first: 20) {
          edges {
            node {
              id
              customAttributes {
                key
                value
              }
            }
          }
        }
      }
    }
    `,
  });
  res.status(200).send(order);
}
catch(err){
  res.json(err)
}
});

export default userRoutes;
