import {
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Text,
    Badge,
    Button,
  } from '@shopify/polaris';
  import React from 'react';

  const ProductsList =({setSelectedDate,setTimes,products,setSelectedProduct,setOpen,setSelectedVariant,setSelectedTime})=> {
    const handleSelectedProduct = (product)=>{
        setSelectedProduct(product)
        setOpen(false)
        setSelectedVariant(null)
        setSelectedDate(null)
        setTimes(null)
        setSelectedTime(null)
    }


    console.log(products)
    const resourceName = {
      singular: 'product',
      plural: 'products',
    };
      useIndexResourceState(products);
    const rowMarkup = products?.map(
      (
        product,
        index,
      ) => {
          const {title,id,images} = product
        return(
          <>
            <IndexTable.Row

            id={id}
          key={id}
          position={index}

        >
          <IndexTable.Cell><img className='custom-bookings-product-image' src={images.nodes[0].url} /></IndexTable.Cell>
          <IndexTable.Cell>{title}</IndexTable.Cell>
          <IndexTable.Cell><Button  onClick={()=>handleSelectedProduct(product)}>Select</Button></IndexTable.Cell>
        </IndexTable.Row>
</>
  )
  },
    );

    return (
      <LegacyCard>
        {
          products &&
          <IndexTable
          hasMoreItems={true}
        selectable={false}
          resourceName={resourceName}
          itemCount={products?.length}
          headings={[
            {title: 'Image'},
            {title: 'Title'},
          ]}
        >
          {rowMarkup}
        </IndexTable>
    }
      </LegacyCard>
    );
  }
  export default ProductsList
