import { Modal, Spinner } from '@shopify/polaris'
import React, { useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch'
import moment from 'moment'

const EditOrder = ({editOpen,setEditOpen,orderId}) => {
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState(null)
    const fetch = useFetch()
    const getOrderById = async ()=>{
        try{
            setLoading(true)
            const response = await fetch(`orders/single/${orderId}`)
            const data = await response.json()
            setOrder(data)
            setLoading(false)
        }
        catch(err){
            setLoading(false)
            console.log(err)
        }
    }
    useEffect(()=>{
        getOrderById()
    },[orderId ])
  return (
    <div>

            <Modal
            open={editOpen}
        onClose={()=>setEditOpen(false)}
        >
         {
            loading ?<div style={{width:'100%',height:"100px", display:'flex', justifyContent:'center', alignItems:'center'}}> <Spinner /></div> :
         <Modal.Section>
            {
                order &&
                <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                <span>Booking Date: {moment(order.bookingDate).format("DD-MM-YYYY")}</span>
                <span>Start Time: {order.startTime}</span>
                <span>End Time: {order.endTime}</span>
            </div>
            }
         </Modal.Section>
        }
        </Modal>
    </div>
  )
}

export default EditOrder
