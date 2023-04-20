import {Router} from 'express'
import clientProvider from '../../utils/clientProvider.js';
import subscriptionRoute from "./recurringSubscriptions.js";

const router = Router()
router.use(subscriptionRoute);
router.get('/', async(req,res)=>{
  try{
      const {search} = req.query
    const { client } = await clientProvider.graphqlClient({
        req,
        res,
        isOnline: false,
      });
        const products =await client.query({
        data:`{
            products(query: "${search}", first: 10) {
                nodes{
                  title
                  id
                  images(first:10){
                    nodes{
                      url
                    }
                  }
                  variants(first:50){
                    nodes{
                      id
                      title
                      price
                    }
                  }
              }
            }
          }`
      })
      res.status(200).json(products)

  }
  catch(err){
    res.status(500).json(err)
  }
})



export default router
