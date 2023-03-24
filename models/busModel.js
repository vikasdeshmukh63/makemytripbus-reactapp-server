const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
    busName: {
        type: String,
        required: true
    },
    busNumber: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    journeyDate: {
        type: String,
        required: true
    },
    departure: {
        type: String,
        required: true
    },
    arrival: {
        type: String,
        required: true
    },
    busType: {
        type: String,
        required: true
    },
    fare: {
        type: Number,
        required: true
    },
    seatsBooked: {
        type: Array,
        default: []
    },
    status: {
        type: String,
        default: "Yet To Start"
    }

});

module.exports = mongoose.model("buses", busSchema);