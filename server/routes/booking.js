import { Router, json } from 'express'
import ProductModel from '../../utils/models/ProductModel.js'
import moment from 'moment'
import axios from 'axios'
const router = Router()

router.post('/book', async (req, res) => {
  try {
    const { line_items } = req.body;
    console.log(req.body)
    const { properties, product_id, variant_title, title } = line_items[0]
    const duration = parseInt(variant_title) + 0.5
    const date = properties?.find((p) => p.name === "Date")
    const time = properties?.find((p) => p.name === "Time")
    const timeInMoment = moment(time.value, 'hh:mm A');
    const subtractedTime = timeInMoment.clone().subtract(30, 'minutes');
    const start = subtractedTime.format('hh:mm A');
    console.log(start)
    const endTime = timeInMoment.clone().add(duration, 'hours');
    const end = endTime.format('hh:mm A');
    console.log(date)
    const product = await ProductModel.create({
      productId: product_id,
      productTitle: title,
      startTime: start,
      endTime: end,
      bookingDate:new Date(date.value),
    })
    res.status(200).json(product)
  }
  catch (err) {
    console.log(err.message)
    res.json(err.message)
  }

})

router.post('/checkbooking', async (req, res) => {
  try {
    const { product_id:productId, variant_id, date:bookingDate } = req.body
    const body = {
      query: `{
            node(id:"gid://shopify/ProductVariant/${variant_id}"){
                 ... on ProductVariant {
                id
                title
                sku
                  metafield(namespace:"variant" key:"time") {
                    value
                  }
              }
            }
          }`, variables: {}
    }
    const { data: productInfo } = await axios.post(
      process.env.STOREFRONT_API,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": process.env.STOREFRONT_ACCESS_TOKEN
        }
      }
    )
    const duration = parseInt(productInfo.data.node.title);
    const currenttimeFromMetafields=  "10:09 am"
    const openingTime =  "09:00 AM";
    const closingTimeBeforeSubstraction = "07:00 PM";
    const closingTimeBeforeSubstractionInMoment = moment(closingTimeBeforeSubstraction, 'hh:mm A');
    const newClosingMoment = closingTimeBeforeSubstractionInMoment.clone().subtract(duration - 0.5, 'hours');
    const closingTime = newClosingMoment.format('hh:mm A');
    // Convert openingTime and closingTime to moment objects
    const openingMoment = moment(openingTime, 'hh:mm A');
    const closingMoment = moment(closingTime, 'hh:mm A');

    // Calculate end time based on duration
    const endMoment = moment("2050-04-28").add(duration, 'hours');

    // Retrieve existing bookings for the product and booking date
    const overlappingBookings = await ProductModel.find({
      productId: productId,
      bookingDate: new Date(bookingDate),
    });

    // Filter for available time slots
    const availableSlots = [];
    let currentMoment = openingMoment.clone();

    while (currentMoment.isBefore(closingMoment)) {
      const overlappingBooking = overlappingBookings.find(booking => {
        const bookingStartTime = moment(booking.startTime, 'hh:mm A');
        const bookingEndTime = moment(booking.endTime, 'hh:mm A');

        // Calculate the difference between current moment and booking start time in minutes
        const durationDiff = bookingStartTime.diff(currentMoment, 'minutes');

        return (
          currentMoment.isBetween(bookingStartTime, bookingEndTime, null, '[)') || // Check for overlapping bookings
          (durationDiff >= 0 && durationDiff < duration * 60) // Check for potential conflicts
        );
      });

      if (!overlappingBooking && currentMoment.isBefore(endMoment)) {
        // If no overlapping booking and current moment is before end moment, add to available slots
        availableSlots.push(currentMoment.format('hh:mm A'));
      }

      currentMoment.add(30, 'minutes'); // Move to next time slot (30 minutes interval)
    }

    res.status(200).json(availableSlots);
    // const duration = parseInt(productInfo.data.node.title)
    // const metafields = JSON.parse(productInfo.data.node.metafield.value)
    // const bookings = await ProductModel.find({
    //   $and: [
    //     { productId: product_id },
    //   ]
    // })
    // const bookedTimeslots = [];
    // // Loop through each document of bookings
    // bookings.forEach((booking) => {
    //   const { startTime, endTime } = booking;

    //   // Convert start and end times to Moment objects
    //   const startMoment = moment(startTime, 'h:mm A');
    //   const endMoment = moment(endTime, 'h:mm A');

    //   // Calculate the number of timeslots between start and end times
    //   const timeslotsCount = endMoment.diff(startMoment, 'minutes') / 30;

    //   // Loop through each timeslot and add it to the booked timeslots array
    //   for (let i = 0; i < timeslotsCount; i++) {
    //     const timeslot = startMoment.add(30, 'minutes').format('hh:mm A');
    //     bookedTimeslots.push(timeslot);
    //   }
    // });
    // const availableSlots = metafields.filter((date)=> !bookedTimeslots.includes(date))
    // res.status(200).json(availableSlots)
  } catch (err) {
    console.log(err.message)
  }
})





// router.post('/checkbooking', async(req,res)=>{
//     try{
//         const hours = 1
//         const {metafields:metafieldsInString, product_id, variant_id} = req.body
//         console.log(variant_id)
//         const metafields = JSON.parse(metafieldsInString)
//         const product = await ProductModel.findOne({
//             $and:[
//                 {productId:product_id},
//             ]
//         })
//         if(!product){
//             return res.status(200).json(metafields)
//         }
//         const formattedTimes = metafields.map(date => moment(date, 'ha').format('HH:mm'));
//         const times = formattedTimes.filter((date)=> !product.times.includes(date))
//         const availableTimes = times.map(date => moment(date, 'HH:mm').format('h:mm a'));
//         const newArray = []
//         for (let i=0; i < availableTimes.length; i++){
//             const diff = moment(availableTimes[i + 1], "HH:mm").diff(moment(availableTimes[i], "HH:mm"), "hours");
//             if(diff === 1){
//                 newArray.push(availableTimes[i])
//                 newArray.push(availableTimes[i + 1])
//             }
//             else{
//                 break;
//             }
//         }
//         const compareDiff = moment(newArray[newArray.length - 1], "HH:mm").diff(moment(newArray[0], "HH:mm"), "hours")
//         if ( compareDiff >= hours) {
//             return res.status(200).json(availableTimes)
//         } else {
//             const removeFromTimes = availableTimes.filter((time)=>!newArray.includes(time))
//             return res.status(200).json(removeFromTimes)
//           }
//     }catch(err){
//         console.log(err.message)
//     }
// })





export default router
