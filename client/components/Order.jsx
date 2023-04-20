import {
  Button,
    IndexTable,
    LegacyCard,
    useIndexResourceState,
  } from '@shopify/polaris';
  import React, { useState } from 'react';
import moment from 'moment';
import EditOrder from './EditOrder';
  const Order = ({orders})=> {
    const [editOpen, setEditOpen] = useState(false)
    const [order, setOrder] = useState(null)
    const handleModalOpen = (order)=>{
      setEditOpen(true)
      setOrder(order)
    }
    const resourceName = {
      singular: 'order',
      plural: 'orders',
    };

    const {selectedResources, allResourcesSelected, handleSelectionChange} =
      useIndexResourceState(orders);

    const rowMarkup = orders?.map((o,index) => {
      const {productTitle,_id, orderNumber, bookingDate, startTime, endTime, paymentStatus, fulfillmentStatus} = o
      const start = moment(startTime, 'hh:mm A').add(30, "minutes").format("hh:mm A")
      const end = moment(endTime, 'hh:mm A').subtract(30, "minutes").format("hh:mm A")
      return(
        <IndexTable.Row
        id={_id}
          key={_id}
        >
          <IndexTable.Cell>{orderNumber}</IndexTable.Cell>
          <IndexTable.Cell>{productTitle}</IndexTable.Cell>
          <IndexTable.Cell>{ moment(bookingDate).format("DD-MM-YYYY")}</IndexTable.Cell>
          <IndexTable.Cell>{start} - {end}</IndexTable.Cell>
          <IndexTable.Cell>
            <Button size='slim' primary={order?.orderNumber == orderNumber} onClick={()=>handleModalOpen(o)}>Edit</Button>
            </IndexTable.Cell>
        </IndexTable.Row>
        )
    },
    );

    return (
      <LegacyCard>
        <IndexTable
          selectable={false}
          resourceName={resourceName}
          itemCount={orders.length}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            {title: 'Order'},
            {title: 'Product Title'},
            {title: 'Date'},
            {title: 'Time',},
            {title: 'Actions',},
          ]}
        >
          {rowMarkup}
        </IndexTable>
        {
          editOpen &&
          <EditOrder setOrder={setOrder} order={order} setEditOpen={setEditOpen} editOpen={editOpen} />
        }
      </LegacyCard>
    );
  }

  export default Order
