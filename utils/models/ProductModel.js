import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    productId:{
        type:String,
    },
    productTitle:{
        type:String,
    },
    date:{
        type:String,
    },
    times:{
        type:[String]
    },
    test:{
        type:Object
    }

})
productSchema.index({ bookingDate: 1 }, { expireAfterSeconds: 60 });

export default mongoose.model('Product', productSchema)
