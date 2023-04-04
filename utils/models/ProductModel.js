import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    productId:{
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
        type:String
    },
    bookingDate:{
        type:Date
    },
})

export default mongoose.model('Product', productSchema)
