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

const catagory = mongoose.model("catagory",  catagorySchema)
module.exports = catagory;
