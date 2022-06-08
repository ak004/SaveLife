const mongoose = require("mongoose")

const chartiySchema = new mongoose.Schema({
    type: {
        type: mongoose.Schema.Types.ObjectId,
    },
    image: {
        type: Array
    },
    des_price: {
        type: Number,
        required: true
    },
    current_price: {
        type: Number,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    organaitazation: {
        type: mongoose.Schema.Types.ObjectId,
    },
    need_type: {
        type: String,
    }, 
    end_date: {
        type: Date,
    },
    status:{
        type: String,
        default: "active"
    }



}, {timestamps: true})

const Chartiy = mongoose.model("Chartiy",  chartiySchema)
module.exports = Chartiy;