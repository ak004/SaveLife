const mongoose = require("mongoose")

const organaizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type:Array,
    },
    org_logo: {
        type:Array,
    },
    description: {
        type: String,
    },
   ownder_name: {
       type:String,
   },
   phone: {
       type: Number,
   },
   contact: {
       type: String,
   },
   Address: {
       type: String,
   },
   owner_image: {
    type:Array,
    },
   status:{
        type: String,
        default: "active"
},
user_id: {
    type: String,
    default: ""
}



}, {timestamps: true})

const Organaization = mongoose.model("Organaization",  organaizationSchema)
module.exports = Organaization;