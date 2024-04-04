import User from "../schema/userSchema.js";
import bcrypt from "bcrypt";
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
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}
export default { signup, login };