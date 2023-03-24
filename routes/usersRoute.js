const router = require("express").Router();
const User = require("../models/usersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const { findById, findByIdAndUpdate } = require("../models/usersModel");

// register new user

router.post("/register", async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.send({
                message: "User already exists",
                success: false,
                data: null
            });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        const newUser = new User(req.body);
        await newUser.save();
        res.send({
            message: "User created successfully",
            success: true,
            data: null
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null
        });
    }
});

// login user

router.post("/login", async (req, res) => {
    try {
        const userExist = await User.findOne({ email: req.body.email });
        if (!userExist) {
            return res.send({
                message: "User does not exist",
                success: false,
                data: null
            });
        }

        if (userExist.isBlocked) {
            return res.send({
                message: "User is Blocked, Please contact the Admin",
                success: false,
                data: null
            })
        }

        const passwordMatch = await bcrypt.compare(req.body.password, userExist.password);

        if (!passwordMatch) {
            return res.send({
                message: "Invalid password",
                success: false,
                data: null
            });
        }

        const token = jwt.sign(
            { userId: userExist._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.send({
            message: "Login successful",
            success: true,
            data: token
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null
        });
    }
});

// get user by id

router.post("/getuserbyid", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        res.send({
            message: "User found",
            success: true,
            data: user
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null
        });
    }
});

// get all users

router.post("/getallusers", authMiddleware, async (req, res) => {
    try {
        const users = await User.find();
        res.send({
            message: "Users fetched successfully",
            success: true,
            data: users
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null
        });
    }
});

// update user

router.post("/updateuser", authMiddleware, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.body._id, req.body);
        res.send({
            message: "User updated successfully",
            success: true,
            data: null
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null
        });
    }
});


// get profile by id

router.post("/getprofilebyid", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        res.send({
            message: "Profile fetched successfully",
            success: true,
            data: user
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null
        });
    }
});


// change password

router.post("/changepassword", authMiddleware, async (req, res) => {
    let userId = { _id: req.body.userId }
    try {
        const user = await User.findOne(userId);
        const passwordMatch = await bcrypt.compare(req.body.oldPassword, user.password);
        if (!passwordMatch) {
            res.send({
                message: "Old password not matched",
                success: false,
                data: null
            });
        }

        if (req.body.newPassword === req.body.cnfPassword) {
            req.body.password = await bcrypt.hash(req.body.newPassword, 10);
            await User.findByIdAndUpdate(user, { password: req.body.password });
            res.send({
                message: "Password changed successfully",
                success: true,
                data: null
            });
        }else{
            res.send({
                message: "New Password & Confirm Password not matched",
                success:false,
                data:null
            });
        }
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null
        })
    }
});

// update profile
router.post("/updateprofilebyid", authMiddleware, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.body.userId,req.body);
        res.send({
            message: "Profile updated successfully",
            success: true,
            data: user
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null
        });
    }
});


module.exports = router;