const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Bus = require("../models/busModel");

//add bus

router.post("/addbus", authMiddleware, async (req, res) => {
    try {
        const existingBus = await Bus.findOne({ busNumber: req.body.busNumber });
        if (existingBus) {
            return res.send({
                message: "Bus already exists",
                success: false
            });
        }
        const newBus = new Bus(req.body);
        await newBus.save();
        return res.send({
            message: "Bus added successfully",
            success: true
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false
        })
    }
});

// get all buses

router.post("/getallbuses", authMiddleware, async (req, res) => {
    const { userId, ...rest } = req.body;
    try {
        const buses = await Bus.find(rest);
        return res.send({
            message: "Buses fetched successfully",
            success: true,
            data: buses
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false
        });
    }
});

// update bus

router.post("/updatebus", authMiddleware, async (req, res) => {
    try {
        await Bus.findByIdAndUpdate(req.body._id, req.body);
        return res.send({
            message: "Bus updated successfully",
            success: true
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false
        });
    }
});

//delete bus

router.post("/deletebus", authMiddleware, async (req, res) => {
    try {
        await Bus.findByIdAndDelete(req.body._id, req.body)
        return res.send({
            message: "Bus deleted successfully",
            success: true
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false
        });
    }
});

// get bus by id

router.post("/getbusbyid", authMiddleware, async (req, res) => {
    try {
        const bus = await Bus.findById(req.body._id);
        return res.send({
            message: "Bus fetched successfully",
            success: true,
            data: bus
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false
        });
    }
});

module.exports = router;