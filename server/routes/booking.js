import { Router } from 'express'
import ProductModel from '../../utils/models/ProductModel.js'
import moment from 'moment'
import axios from 'axios'
import { google } from 'googleapis'
import {sendEmail} from '../../utils/sendEmail.js'
import verifyRequest from '../middleware/verifyRequest.js'
const router = Router()

router.post('/book', async (req, res) => {
  try {
    const { line_items, name: orderNumber, created_at: createdAt } = req.body;
    const { properties, product_id, variant_title, title, email, variant_id: variantId } = line_items[0]
    const duration = parseInt(variant_title) + 0.5 // Adding 0.5 will add half hour to the booking date
    const date = properties?.find((p) => p.name === "Date") //booking Date Sent By User
    const time = properties?.find((p) => p.name === "Time")// booking Time Sent By User
    const bookingDate = moment(date.value).format("YYYY-MM-DD")
    const timeInMoment = moment(time.value, 'hh:mm A');
    const start = timeInMoment.clone().subtract(30, 'minutes').format('hh:mm A');
    const end = timeInMoment.clone().add((duration * 60), 'minutes').format('hh:mm A');
    const product = await ProductModel.create({
      duration: parseInt(variant_title),
      productId: product_id,
      productTitle: title,
      startTime: start,
      endTime: end,
      bookingDate,
      orderNumber,
      variantId,
      createdAt,
    })
    res.status(200).json(product)
  }
  catch (err) {
    res.status(500).json(err.message)
  }

})

router.post('/checkbooking', async (req, res) => {
  try {
    const { product_id: productId, variant_id, date: bookingDate,variant_title } = req.body
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
    // const { data: productInfo } = await axios.post(
    //   process.env.STOREFRONT_API,
    //   body,
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       "X-Shopify-Storefront-Access-Token": process.env.STOREFRONT_ACCESS_TOKEN
    //     }
    //   }
    // )
    let openingTime = "09:00 AM";
    const openMoment = moment(openingTime, "hh:mm a")
    const currentTime = moment()
    const currentDate = currentTime.clone().format('YYYY-MM-DD')
    currentTime.hour(currentTime.hour() + 1).startOf('hour').minute(0);
    if (currentTime.isAfter(openMoment) && currentDate === bookingDate) {
      openingTime = currentTime.format("hh:mm A");
    }


    // const duration = parseInt(productInfo.data.node.title.at(0));
    const duration = parseInt(variant_title);
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
      bookingDate: bookingDate,
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
  } catch (err) {
    console.log(err.message)
  }
})

const UpdateCalender = async (data) => {
  const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
  const calendarId = process.env.CALENDAR_ID;

  // Google calendar API settings
  const SCOPES = 'https://www.googleapis.com/auth/calendar';
  const calendar = google.calendar({ version: "v3" });

  const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
  );

  console.log(data)

  // var data = {
  //   bookingDate: "2023-04-15",
  //   duration: 2,
  //   orderId: "64344620b04bb37389d59363",
  //   time: "12:30 pm",
  //   name: "#1066"
  //   }


  // let start = '2023-04-01T11:10:00.000Z';
  // let end = '2100-04-30T12:10:00.000Z';
  let events = "";
  let updateId = "";

  const getEvents = async () => {
    try {
      let response = await calendar.events.list({
        auth: auth,
        calendarId: calendarId,
        // timeMin: start,
        // timeMax: end,
        singleEvents: true,
        orderBy: 'startTime'
      });
      if (response.data.items.length === 0) {
        return 0;
      } else {
        return response.data.items;
      }
    } catch (error) {
      console.log(`Error at getEvents --> ${error}`);
      return 0;
    }
  };



  getEvents()
    .then((res) => {
      if (res != 0) {
        let events = res;
        console.log(events);

        console.log(data.name);

        events.filter((event) => {
          if (event.summary.includes(data.name)) {
            console.log(event.id);
            updateId = event.id;
          }
        });
      }

      let eventId = updateId;

      let startdate = moment(data['bookingDate']).format('YYYY-MM-DD');
      let enddate = moment(data['bookingDate']).format('YYYY-MM-DD');
      let time = data['time'];
      let duration = data['duration'];
      let startdat = moment(`${startdate} ${time}`).format('YYYY-MM-DDTHH:mm:ss');
      let enddat = moment(`${enddate} ${time}`).add(duration, 'hours').format('YYYY-MM-DDTHH:mm:ss');
      console.log(startdat);
      console.log(enddat);
      let event = {
        'start': {
          'dateTime': startdat,
          'timeZone': 'Asia/Karachi'
        },
        'end': {
          'dateTime': enddat,
          'timeZone': 'Asia/Karachi'
        }
      };
      const updateEvent = async (eventId, event) => {
        try {
          let response = await calendar.events.patch({
            auth: auth,
            calendarId: calendarId,
            eventId: eventId,
            resource: event
          });
          if (response.data === '') {
            return 1;
          } else {
            return 0;
          }
        } catch (error) {
          console.log(`Error at updateEvent --> ${error}`);
          return 0;
        }
      };
      updateEvent(eventId, event)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

    })
    .catch((err) => {
      console.log(err);
    });
}


router.put('/change',verifyRequest, async (req, res) => {
  try {
    const { orderId, time, bookingDate,notification } = req.body
    console.log(req.body)
    console.log('test')
    const duration = req.body.duration + 0.5
    const timeInMoment = moment(time, 'hh:mm A');
    const start = timeInMoment.clone().subtract(30, 'minutes').format("hh:mm A");
    const end = timeInMoment.clone().add(duration, 'hours').format('hh:mm A');
    const product = await ProductModel.findById(orderId)
    product.bookingDate = bookingDate
    product.startTime = start
    product.endTime = end
    await product.save()
    UpdateCalender({
      duration: parseInt(duration - 0.5),
      eventId: "7o5fsibjssa6mi5gb40p0q85p8",
      bookingDate,
      time,
      name: product.orderNumber
    })
    res.status(200).json({})
    console.log(notification)
    if(notification === true){
      sendEmail({
        email:"immersivetechlabs@gmail.com",
        subject:"Booking Update",
        text:`Your Booking has been changed to ${bookingDate} at ${time} `
      })
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

router.post('/delete', async (req, res) => {
  try {
    const { name } = req.body
     await ProductModel.deleteOne({
      orderNumber:name
    })
    res.status(200).json("order deleted")
  } catch (err) {
    res.status(500).json(err)
  }
})


export default router
