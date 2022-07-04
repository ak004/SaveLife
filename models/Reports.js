const mongoose = require("mongoose")

const reportSchema = new mongoose.Schema({
    report: {
        type: String,
    },
    discrition: {
        type:String,
    },
    images: {
        type: Array
    },
    recipts_imgs: {
        type: Array
    },
    lists_of_items: {
        type: Array,
        default: []
    },
    org_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    catagory_id: {
        type: mongoose.Schema.Types.ObjectId,
    },


}, {timestamps: true})

const Reports = mongoose.model("Reports",  reportSchema)
module.exports = Reports;