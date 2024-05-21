import User from "../schema/userSchema.js";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const signup = async (req, res) => {

    //if there are any errors in the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }

    try {
        let success = false;

        //check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "Sorry a user with this email already exists" })
        }

        //encrypting the password
        const salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(req.body.password, salt);

        //create a new user
        user = await User.create({
            firstName: req.body.fname,
            lastName: req.body.lname,
            email: req.body.email,
            phone: req.body.phone,
            password: securedPassword,
        });

        success = true;
        res.status(201).json({ success, message: "User created successfully" });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }

    try {

        let success = false;

        //check whether the user with this email exists
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }

        //check password
        const passwordCompare = await bcrypt.compare(req.body.password, user.password); //compare returns a boolean
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }

        //create jwt token
        const data = {
            id: user._id
        };

        const authToken = jwt.sign(data, process.env.JWT_SECRET);

        success = true;

        //delete password from response
        const { password, ...others } = user._doc;

        return res.status(200).json({ success, message: "Login successful", authToken, user: others });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const googleAuth = async (req, res) => {
    try {
        let success = false;

        //check whether the user with this email exists
        let user = await User.findOne({ email: req.body.email });
        if (user) {

            //create jwt token
            const payload = {
                id: user._id
            };

            const authToken = jwt.sign(payload, process.env.JWT_SECRET);
            const { password, ...others } = user._doc;
            return res.status(200).json({ success: true, authToken, user: others });
        } else {
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const securedPassword = await bcrypt.hash(generatePassword, salt);

            //create a new user
            user = await User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: Math.floor(1000000000 + Math.random() * 9000000000),
                password: securedPassword,
                image: req.body.photo
            });

            success = true;
            const payload = {
                id: user._id
            };
            const authToken = jwt.sign(payload, process.env.JWT_SECRET);
            const { password, ...others } = user._doc;
            return res.status(200).json({ success: true, authToken, user: others });
        }

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const updateProfile = async (req, res) => {
    try {
        let success = false;
        if (!req.user) {
            return res.status(400).json({ success, message: "Please login to update your profile" });
        }

        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ success, message: "Sorry a user with this email already exists" });
        }

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        user = await User.findByIdAndUpdate(req.user.id, {
            $set: {
                firstName: req.body.fname,
                lastName: req.body.lname,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                image: req.body.image
            }
        }, { new: true });

        success = true;
        return res.status(200).json({ success, message: "Profile updated successfully", user });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json({ success: true, message: "All users", users });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const verifyCoupon = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }
    try {
        let success = false;
        const id = new Types.ObjectId(req.params.id)
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ success, message: "User not found" });
        }

        const validCoupon = user.coupon.find((coupon) => coupon.code === req.body.coupon);

        if (!validCoupon) {
            return res.status(400).json({ success, message: "Invalid coupon" });
        }

        success = true;
        return res.status(200).json({ discount: validCoupon.discount, success, message: "Coupon applied with discount of " + validCoupon.discount + "% of 100 Rs" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
export default { signup, login, googleAuth, updateProfile, getAllUsers, verifyCoupon };