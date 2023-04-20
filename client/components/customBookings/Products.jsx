import { Banner, Button, DatePicker, Layout, LegacyCard, Loading, Modal, Spinner, Text, TextField, Thumbnail } from '@shopify/polaris'
import React, { useCallback, useEffect, useState } from 'react'
import useFetch from '../../hooks/useFetch';
import ProductsList from './ProductsList';
import moment from 'moment';
import { fetchavailableTimesForCustomOrder, handleCreateOrder } from '../../apiCalls/ordersApis';
import { useNavigate } from 'raviger';
import { fetchProducts } from '../../apiCalls/productsApis';

const Products = () => {
    //States
    const [times, setTimes] = useState(null);
    const [products, setProducts] = useState(null);
    const [value, setValue] = useState('');
    const [open, setOpen] = useState(false);
    //Loading States
    const [loading, setLoading] = useState(false);
    const [createOrderLoading, setCreateOrderLoading] = useState(false);
    const [checkBookingLoading, setCheckBookingLoading] = useState(false);
    //Selection States
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    //Variables
    const navigate = useNavigate()
    const productId = selectedProduct?.id.split('/')[4]
    const variantTitle = selectedVariant?.at(0)
    const handleChange = useCallback((newValue) => setValue(newValue), []);
    const fetch = useFetch()
    const currentDate = moment()
    const currentMonth = currentDate.clone().subtract(1, 'month').format("M") // I did this because there is some bug is polaris, lets say if I give it march it selects april
    const yesterday = currentDate.clone().subtract(1, 'day').toDate()

    useEffect(()=>{
        selectedDate && fetchavailableTimesForCustomOrder(setCheckBookingLoading,setSelectedTime,setTimes,productId,variantTitle,moment(selectedDate).format("YYYY-MM-DD"))
    },[selectedDate,selectedVariant ])
    console.log(selectedVariant)
    const [{month, year}, setDate] = useState({month:parseInt(currentMonth), year:currentDate.format("YYYY")});
    const handleMonthChange = useCallback((month, year) => setDate({month, year}),[],);

    return (
        <Layout.Section>
            <LegacyCard
             title="Products"
              sectioned>
                <TextField
                 value={value}
                 onChange={handleChange}
                 connectedRight={<Button onClick={()=>fetchProducts(value,setOpen,setLoading,setProducts,fetch)}>{value.length < 1 ? "All" : "Search"}</Button>}
                 placeholder="Search Products"
                  />
                <Modal title="Products" open={open} onClose={()=>setOpen(false)}>
                    <Modal.Section>
                        {
                            loading ?
                            <div className='custom-bookings-products-search-loading'>
                            <Spinner   />
                            </div>
                            :
                            <div className='custom-bookings-products-list-container'>
                            <ProductsList setSelectedTime={setSelectedTime} setTimes={setTimes} setSelectedDate={setSelectedDate} setCheckBookingLoading={setCheckBookingLoading} setSelectedVariant={setSelectedVariant} setOpen={setOpen} setSelectedProduct={setSelectedProduct} products={products} />
                            </div>
                        }
                    </Modal.Section>
                </Modal>
            </LegacyCard>
            {
                selectedProduct &&
                <LegacyCard
                primaryFooterAction={{
                    content:"Create",
                    onAction:()=>handleCreateOrder({
                        variantId,
                        bookingDate:moment(selectedDate).format("YYYY-MM-DD"),
                        time:selectedTime,
                        customer:{
                            firstName:"Hamza",
                            lastName:"K",
                            email:"hamza@gmail.com"
                        }
                    },
                    setCreateOrderLoading,
                    navigate,
                    fetch
                    ),
                    loading:createOrderLoading,
                    disabled:selectedTime === null
                }}
                title="Selected Product" sectioned>
                <div className='custom-bookings-selected-product-container'>
                <Thumbnail size='large'source={selectedProduct.images.nodes[0].url}/>
                <Text variant='headingMd' as='h6' fontWeight='regular' >{selectedProduct.title}</Text>
                </div>
                <div className='custom-bookings-variants-container'>
                    {
                        selectedProduct.variants.nodes.map((variant)=>(
                            <Button size='slim' primary={selectedVariant === variant.title} onClick={()=>setSelectedVariant(variant.title)}>{variant.title}</Button>
                        ))
                    }
                </div>
                <div className='custom-bookings-dates-container'>
                <div className='custom-bookings-date-picker'>
                    {
                        selectedVariant &&
                        <DatePicker
                        month={month}
      year={year}
      disableDatesBefore={yesterday}
      selected={selectedDate}
      onChange={(date)=>setSelectedDate(date.start)}
      onMonthChange={handleMonthChange}
      />
    }
      </div>
      <div className='custom-booking-available-times-container'>
       {
        checkBookingLoading ? <Spinner /> :
        times?.length !== 0 ? times?.map((time)=>(
            <Button onClick={()=>setSelectedTime(time)} primary={selectedTime === time} size='slim'>{time}</Button>
        ))
        :
        <Banner title='No Bookings Found' status='critical' />
       }
      </div>
      </div>
            </LegacyCard>
            }
        </Layout.Section>
    )
}

export default Products
