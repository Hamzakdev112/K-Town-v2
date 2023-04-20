import { Modal, Spinner } from '@shopify/polaris'
import React, { useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch'
import moment from 'moment'
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import '../styles/editorder.css'
import { changeOrder, fetchavailableTimesOfOrder } from '../apiCalls/ordersApis';
import { useDispatch } from 'react-redux';

const EditOrder = ({editOpen,setEditOpen,order,setOrder}) => {
    const [updating, setUpdating] = useState(false)
    const [checkBookingLoading, setCheckBookingLoading] = useState(false)
    const [times, setTimes] = useState(null)
    const [selectedTime, setSelectedTime] = useState(null)
    const [bookingDate, setBookingDate] = useState(order.bookingDate)
    const [notification, setNotification] = useState(false)
    const fetch = useFetch()
    const dispatch = useDispatch()

    const handleClose = ()=>{
        setEditOpen(false)
        setOrder(null)
    }

    useEffect(()=>{
        fetchavailableTimesOfOrder(setCheckBookingLoading,setSelectedTime,setTimes,order.productId,order.duration,bookingDate)
    },[bookingDate])
  return (
    <div>
            <Modal
            open={editOpen}
        onClose={handleClose}
        primaryAction={{
            content:"Change",
            onAction:()=>changeOrder(setOrder,setUpdating,setEditOpen,fetch,dispatch,{
                orderId:order._id,
                selectedTime,
                bookingDate,
                duration:order.duration,
                notification
            }),
            loading:updating,
            disabled:selectedTime === null
        }}
        >
         <Modal.Section>
                <div className='date-picker-container' >
                {/* <span>Booking Date: {moment(bookingDate).format("DD-MM-YYYY")}</span> */}
                <span>Change booking date</span>
                <Flatpickr
                unselectable={bookingDate}
                onChange={([value])=>setBookingDate(moment(value).format("YYYY-MM-DD"))}
        value={bookingDate}
      />
            </div>
            <div className='available-times-container'>
        {
            checkBookingLoading ? <div className='available-times-loading' ><Spinner /></div> :
        times &&

        times.map((time)=>(
            <button
            onClick={()=>(setSelectedTime(time))}
            className={`edit-order-time-button ${selectedTime === time && "selected-time"}`}
             key={time}
             >{time}</button>
        ))
        }
        </div>
        <div style={{display:'flex', alignItems:'center', marginTop:'20px'}}>
        <span>Notify Customer</span>
        <input onChange={(e)=>setNotification(e.target.checked)} type="checkbox" />
        </div>
         </Modal.Section>
        </Modal>
    </div>
  )
}

export default EditOrder
