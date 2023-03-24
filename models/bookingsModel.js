const mongoose = require("mongoose");
const Bus = require("./busModel");


const bookingsSchema = new mongoose.Schema({
    bus: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'buses',
        required: true
    },
    user: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    seats:{
        type:Array,
        required:true
    },
    transactionId:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

module.exports = mongoose.model("bookings",bookingsSchema);