const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    comment: {
        reviews: String,
    },
    username: {
        type: String
    },
    user_image: {
        type: String
    },
    type_id: {
        type: mongoose.Schema.Types.ObjectId,
    }


}, {timestamps: true})

const Review = mongoose.model("Review",  reviewSchema)
module.exports = Review;