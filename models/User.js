const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        default: "user"
    },
    status: {
        type: Number,
        required: true,
        default: 0
    },
    token: {
        typr: String,
        default: ""
    }

})

const User = mongoose.model("User",  userSchema)
module.exports = User;