import {Router} from 'express'
import ProductModel from '../../utils/models/ProductModel.js'
import moment from 'moment'
const router = Router()


// router.get('/:productId',async (req,res)=>{
//     const {productId} = req.params
//     const products = await ProductModel.find({
//         productId
//     })
//     res.json(products)
// })


router.post('/book',async (req,res)=>{
try{
    let bookedProduct;
    const { line_items } = req.body;
    const {properties,product_id, variant_title,title} = line_items[0]
    console.log(line_items[0])
    const duration = parseInt(variant_title) + 1
    const date = properties?.find((p)=>p.name === "Date")
    const time = properties?.find((p)=>p.name === "Time")

    const start = moment(`${date.value} ${time.value}`, 'YYYY-MM-DD HH:mm');
    const end = start.clone().add(duration, 'hours');
    const times = [start.format('HH:mm')];

    if (duration > 1) {
        let nextTime = start.clone().add(1, 'hour');
        while (nextTime.isBefore(end)) {
            times.push(nextTime.format('HH:mm'));
            nextTime.add(1, 'hour');
        }
    }
    console.log(times)
    const product = await ProductModel.findOne({
        $and:[
            {productId:product_id},
            {date:date.value}
        ]
    }).select('productId')
    console.log(product)
    if(!product){
        bookedProduct = await ProductModel.create({
            productId:product_id,
            productTitle:title,
            date:date.value,
            times:times,
        })
        return res.status(200).json(bookedProduct)
    }
      product.times.push(...times)
        await  product.save()
    return res.status(200).json('updated')
}
catch(err){
    console.log(err.message)
    res.json(err.message)
}

})

router.post('/checkbooking', async(req,res)=>{
    try{
        const {metafields, product_id} = req.body
        return res.json(metafields)
        const product = await ProductModel.findOne({
            $and:[
                {productId:product_id},
            ]
        })
        const formattedTimes = metafields.map(date => moment(date, 'ha').format('HH:mm'));
        const times = formattedTimes.filter((date)=> !product.times.includes(date))
        const availableTimes = times.map(date => moment(date, 'HH:mm').format('h:mm a'));
        res.json(availableDates)
    }catch(err){
        console.log(err.message)
    }
})






export default router
