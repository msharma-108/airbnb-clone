const { default: mongoose } = require("mongoose");

const paymentschema = new mongoose.Schema({
    razorpay_payment_id:{
        type:String,
        required:true
    },
    razorpay_order_id:{
        type:String,
        required:true
    },
    razorpay_signature:{
        type:String,
        required:true
    },
    payer_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    payee_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    }
})

module.exports= new mongoose.model("payment",paymentschema)