const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
    User_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    amount: {
        type: Number,
        default: 0
    },
    charaty_id: {
        type: mongoose.Schema.Types.ObjectId,
    },



}, {timestamps: true})

const Payment = mongoose.model("Payment",  paymentSchema)
module.exports = Payment;