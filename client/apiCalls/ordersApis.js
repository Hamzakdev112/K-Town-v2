import axios from "axios"
import { getAllOrdersFailure, getAllOrdersStart, getAllOrdersSuccess } from "../redux/slices/ordersSlice"

export const fetchAllOrders = async (fetch,dispatch)=>{
    try{
        dispatch(getAllOrdersStart())
        const response = await fetch("orders/all")
        const data = await response.json()
       dispatch(getAllOrdersSuccess(data))
    }catch(err){
        dispatch(getAllOrdersFailure(err))
    }
}
export const changeOrder = async (setOrder,setUpdating, setEditOpen,fetch,dispatch, data)=>{
    try{
        setUpdating(true)
        const payload = {
            orderId:data.orderId,
            time:data.selectedTime,
            bookingDate:data.bookingDate,
            duration:data.duration,
            notification:data.notification,
        }
        const response = await fetch('/booking/change',{
            method:'PUT',
            headers:{
            'Content-Type':'application/json'
            },
            body:JSON.stringify(payload)
        })
        console.log(response)
        //  await axios.put('/booking/change', {
        //     orderId:data.orderId,
        //     time:data.selectedTime,
        //     bookingDate:data.bookingDate,
        //     duration:data.duration,
        //     notification:data.notification,
        // })
        if(response.status === 200){
            setUpdating(false)
            setOrder(null)
            setEditOpen(false)
            fetchAllOrders(fetch,dispatch)
        }
    }catch(err){
        setUpdating(false)
        console.log(err)
    }
}

export const fetchavailableTimesOfOrder = async(setCheckBookingLoading,setSelectedTime,setTimes, productId,variantTitle,bookingDate)=>{
        const payload = {
            product_id:productId,
            variant_title:variantTitle,
            date:bookingDate
        }
        try{
            setCheckBookingLoading(true)
            setSelectedTime(null)
            const {data} = await axios.post('/booking/checkbooking',payload )
            setTimes(data)
            setCheckBookingLoading(false)
        }catch(err){
            console.log(err)
        }
}
export const fetchavailableTimesForCustomOrder = async(setCheckBookingLoading,setSelectedTime,setTimes, productId,variantTitle,bookingDate)=>{
        const payload = {
            product_id:productId,
            variant_title:variantTitle,
            date:bookingDate
        }
        try{
            setCheckBookingLoading(true)
            setSelectedTime(null)
            const {data} = await axios.post('/booking/checkbooking',payload )
            setTimes(data)
            setCheckBookingLoading(false)
        }catch(err){
            setCheckBookingLoading(false)
            console.log(err)
        }
}


export const handleCreateOrder =async (body, setCreateOrderLoading, navigate,fetch)=>{
    try{
        setCreateOrderLoading(true)
        const response  = await fetch("/orders/create",{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(body)
        })
        setCreateOrderLoading(false)
        response.status === 200 && navigate("/orders")
    }catch(err){
        setCreateOrderLoading(false)
        console.log(err)
    }

}
