const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    type: {
        reviews: String,
    },
    username: {
        type: String
    },
    type_id: {
        type: mongoose.Schema.Types.ObjectId,
    }


}, {timestamps: true})

const Review = mongoose.model("Review",  reviewSchema)
module.exports = Review;