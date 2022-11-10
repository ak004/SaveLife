const mongoose = require("mongoose")

const catagorySchema = new mongoose.Schema({

    type: {
        type: String,
    },
    status: {
        type: String,
        default: "active"
    }

}, {timestamps: true})

const Catagory = mongoose.model("Catagory",  catagorySchema)
module.exports = Catagory;