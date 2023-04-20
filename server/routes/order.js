import { Router } from "express";
const router = Router()
import ProductModel from "../../utils/models/ProductModel.js";
import clientProvider from "../../utils/clientProvider.js";


//get all orders
router.get('/all', async(req,res)=>{
    try{
        const orders = await ProductModel.find().sort({createdAt: -1})
        res.status(200).json(orders)

    }catch(err){
        res.status(500).json(err)
    }
})

// Create custom order

router.post('/create', async(req,res)=>{
  try{
    const {variantId, bookingDate, time, customer} = req.body
    const {client} = await clientProvider.restClient({req,res,isOnline:false});
    const order = await client.post({
      path:"admin/api/2023-04/orders.json",
      data:{
        order: {
          line_items: [
            {
              variant_id: variantId,
              quantity: 1,
              properties: [
                {
                  name: "Date",
                  value: bookingDate
                },
                {
                  name: "Time",
                  value: time
                },
              ]
            }
          ],
          customer: {
            first_name: customer.firstName,
            last_name: customer.lastName,
            email: customer.email
          },
          financial_status: "pending"
        }
      }
    })
    res.json(order)
  }
catch(err){
  res.status(500).json(err)
}
})


export default router
