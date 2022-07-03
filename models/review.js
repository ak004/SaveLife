const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
    },
    username: {
        type: String
    },
    user_image: {
        type: String,
        default: "uploads/person-icon.png"
    },
    divice_id: {
        type: String,
    },
    type_id: {
        type: mongoose.Schema.Types.ObjectId,
    }


}, {timestamps: true})

const Review = mongoose.model("Review",  reviewSchema)
module.exports = Review;