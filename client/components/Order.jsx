import {
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Text,
    Badge,
  } from '@shopify/polaris';
  import React, { useState } from 'react';
import moment from 'moment';
import EditOrder from './EditOrder';
  const Order = ({orders})=> {

    const [editOpen, setEditOpen] = useState(false)
    const [orderId, setOrderId] = useState('')
    const handleModalOpen = (orderId)=>{
      setEditOpen(true)
      setOrderId(orderId)
    }

    console.log(orderId)
    const resourceName = {
      singular: 'order',
      plural: 'orders',
    };

    const {selectedResources, allResourcesSelected, handleSelectionChange} =
      useIndexResourceState(orders);

    const rowMarkup = orders?.map(
      (
        {productTitle,_id, order, bookingDate, startTime, endTime, paymentStatus, fulfillmentStatus},
        index,
      ) => (
        <IndexTable.Row
          id={_id}
          key={_id}
          // selected={selectedResources.includes(id)}
          // position={index}
        >
          <IndexTable.Cell>
          <IndexTable.Cell>{productTitle}</IndexTable.Cell>
          </IndexTable.Cell>
          <IndexTable.Cell>{ moment(bookingDate).format("DD-MM-YYYY")}</IndexTable.Cell>
          <IndexTable.Cell>{startTime} - {endTime}</IndexTable.Cell>
          <IndexTable.Cell><button onClick={()=>handleModalOpen(_id)}>Edit</button></IndexTable.Cell>
          {/* <IndexTable.Cell>{endTime}</IndexTable.Cell>
          <IndexTable.Cell>{fulfillmentStatus}</IndexTable.Cell> */}
        </IndexTable.Row>
      ),
    );

    return (
      <LegacyCard>
        <IndexTable
          resourceName={resourceName}
          itemCount={orders.length}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            {title: 'Product Title'},
            {title: 'Date'},
            {title: 'Time',},
            {title: 'Actions',},
            // {title: 'End Time'},
            // {title: 'Fulfillment status'},
          ]}
        >
          {rowMarkup}
        </IndexTable>
        {
          editOpen &&
          <EditOrder orderId={orderId} setEditOpen={setEditOpen} editOpen={editOpen} />
        }
      </LegacyCard>
    );
  }

  export default Order
