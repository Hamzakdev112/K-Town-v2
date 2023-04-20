import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    productId:{
        type:String,
    },
    orderNumber:{
        type:String,
    },
    variantId:{
        type:String,
    },
    productTitle:{
        type:String,
    },
    startTime:{
        type:String,
    },
    endTime:{
        type:String
    },
    duration:{
        type:Number
    },
    bookingDate:{
        type:String
    },
    createdAt:{
        type:Date,
    },
},{
    expireAfterSeconds:'60'
})

export default mongoose.model('Product', productSchema)
