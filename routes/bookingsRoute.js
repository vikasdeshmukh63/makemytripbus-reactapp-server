const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Booking = require("../models/bookingsModel");
const Bus = require("../models/busModel");
const stripe = require('stripe')(process.env.STRIPE_KEY);
const { v4: uuidv4 } = require('uuid');

// book a seat
router.post("/bookseat", authMiddleware, async (req, res) => {
    try {
        const newBooking = new Booking({
            ...req.body,
            user: req.body.userId
        });
        await newBooking.save();
        const bus = await Bus.findById(req.body.bus);
        bus.seatsBooked = [...bus.seatsBooked, ...req.body.seats];
        await bus.save();
        res.send({
            message: "Booking successful",
            success: true,
            data: newBooking
        });
    } catch (error) {
        res.send({
            message: "Booking failed",
            success: false,
            data: null
        });
    }
});

// payment route

router.post("/payment", authMiddleware, async (req, res) => {
    try {
        const { token, amount } = req.body;
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });
        const payment = await stripe.paymentIntents.create({
            amount: amount,
            currency: "inr",
            customer: customer.id,
            receipt_email: token.email,
        }, {
            idempotencyKey: uuidv4()
        });

        if (payment) {
            res.send({
                message: "Payment successful",
                success: true,
                data: {
                    transactionId: payment.id
                }
            })
        } else {
            res.send({
                message: "Payment failed",
                success: false,
                data: null
            });
        }
    } catch (error) {
        res.send({
            message: "Payment failed",
            success: false,
            data: null
        })
    }
});

// get bookings by user id

router.post("/getbookingsbyuserid",authMiddleware,async(req,res) => {
    try {
        const bookings = await Booking.find({
            user: req.body.userId
        }).populate("bus").populate("user")
        res.send({
            message:"Bookings fetched successfully",
            success:true,
            data:bookings
        });
    } catch (error) {
        res.send({
            message:"Bookings fetch failed",
            success:false,
            data:null
        });
    }
});

// get all bookings

router.post("/getallbookings",authMiddleware,async(req,res) => {
    try {
        const bookings = await Booking.find().populate("bus").populate("user")
        res.send({
            message:"Bookings fetched successfully",
            success:true,
            data:bookings
        });
    } catch (error) {
        res.send({
            message:"Bookings fetch failed",
            success:false,
            data:null
        });
    }
});


module.exports = router;