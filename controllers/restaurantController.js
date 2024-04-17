import Restaurant from "../schema/restaurantSchema.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

const register = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }

    try {
        let success = false;

        let restaurant = await Restaurant.findOne({ email: req.body.email });
        if (restaurant) {
            return res.status(400).json({ success, message: "Sorry a restaurant with this email already exists" });
        }

        //encrypting the password
        const salt = bcrypt.genSaltSync(10);
        const securedPassword = bcrypt.hashSync(req.body.password, salt);
        restaurant = await Restaurant.create({
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            pincode: req.body.pincode,
            state: req.body.state,
            cuisine: req.body.cuisine,
            keywords: req.body.keywords,
            hours: req.body.hours,
            phone: req.body.phone,
            email: req.body.email,
            password: securedPassword,
            bankname: req.body.bankname,
            accountno: req.body.accountno,
            ifsc: req.body.ifsc,
            menuUrl: req.body.menuUrl,
            imgUrls: req.body.imgUrls
        });

        success = true;
        return res.status(200).json({ success, restaurant, message: "Restaurant registered successfully" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }

    try {

        let success = false;

        //check whether the restaurant with this email exists
        let restaurant = await Restaurant.findOne({ email: req.body.email });
        if (!restaurant) {
            return res.status(400).json({ success, message: "Please try to login with correct credentials" });
        }

        //check password
        const passwordCompare = await bcrypt.compare(req.body.password, restaurant.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, message: "Please try to login with correct credentials" });
        }

        const payload = {
            id: restaurant._id
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET);
        success = true;
        return res.status(200).json({ success, token });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

export default { register, login };