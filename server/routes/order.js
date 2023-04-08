import { Router } from "express";
const router = Router()
import ProductModel from "../../utils/models/ProductModel.js";


//get all orders
router.get('/all', async(req,res)=>{
    try{
        const orders = await ProductModel.find()
        res.status(200).json(orders)

    }catch(err){
        res.status(500).json(err)
    }
})
//get order by id
router.get('/single/:orderId', async(req,res)=>{
    try{
        const {orderId} = req.params
        const order = await ProductModel.findById(orderId)
        if(!order){
            return res.status(404).json("Order Not Found")
        }
        res.status(200).json(order)

    }catch(err){
        res.status(500).json(err)
    }
})


export default router
